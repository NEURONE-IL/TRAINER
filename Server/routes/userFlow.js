const express = require('express');
const router = express.Router();
const UserFlow = require('../models/userFlow');
const Stage = require('../models/stage');
const Module = require('../models/module');
const Flow = require('../models/flow');
const { fetchAndUpdateStages } = require("../utils/routeUtils");

const verifyToken = require('../middlewares/verifyToken');

router.get('/getProgress/:student_id',  async (req, res) => {
    const _id = req.params.student_id;
    UserFlow.findOne({user: _id}, (err, userFlow) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            userFlow
        });
    }).populate({ path: 'modules.module', model: Module }).populate({ path: 'modules.stages.stage', model: Stage });
});

router.put('/updateProgress/:student_id', async (req, res) => {
    const userId = req.params.student_id;
    await UserFlow.findOne({user: userId}, (err, userFlow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.assent){
            userFlow.assent = req.body.assent;
        }
        if(req.body.finished){
            userFlow.finished = req.body.finished;
            userFlow.finishedAt = Date.now();
        }
        if(req.body.lastStagePlayed){
            userFlow.lastStagePlayed = req.body.lastStagePlayed;

            //update stage times
            let userFlowModulesAux = userFlow.modules;
            userFlowModulesAux.forEach((objModulo, i) => {
                objModulo.stages.forEach((objEtapa, j) => {
                    //update started time
                    if((objEtapa.stage._id == req.body.lastStagePlayed) && !userFlow.modules[i].stages[j].startedAt){
                        userFlow.modules[i].stages[j].startedAt = Date.now();
                    }
                    // update last entry time
                    if(objEtapa.stage._id == req.body.lastStagePlayed){
                        userFlow.modules[i].stages[j].lastEntry = Date.now();
                    }
                });
            });
        }
        if(req.body.modules){
            userFlow.modules = req.body.modules;
            req.body.modules.forEach((objModule, i) => {
                if(objModule.completed == true && !objModule.completedAt){
                    userFlow.modules[i].completedAt = Date.now();
                }

                objModule.stages.forEach((objStage, j) => {
                    if(objStage.completed == true && !objModule.completedAt){
                        userFlow.modules[i].stages[j].completedAt = Date.now();
                    }
                });
            });
        }
        userFlow.updatedAt = Date.now();
        userFlow.save((err, userFlow) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                userFlow
            })
        })
    }).populate({ path: 'modules.module', model: Module }).populate({ path: 'modules.stages.stage', model: Stage });
});

module.exports = router;