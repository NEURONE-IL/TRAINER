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
        if(req.body.assent !== null){
            userFlow.assent = req.body.assent;
        }
        if(req.body.finished !== null){
            userFlow.finished = req.body.finished;
        }
        if(req.body.lastStagePlayed !== null){
            userFlow.lastStagePlayed = req.body.lastStagePlayed;
        }
        if(req.body.modules !== null){
            userFlow.modules = req.body.modules;
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