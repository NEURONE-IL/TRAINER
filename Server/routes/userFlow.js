const express = require('express');
const router = express.Router();
const UserFlow = require('../models/userFlow');
const Stage = require('../models/stage');
const Flow = require('../models/flow');
const { fetchAndUpdateStages } = require("../utils/routeUtils");

const verifyToken = require('../middlewares/verifyToken');

router.get('/stagesByStudent/:student_id', [verifyToken], async (req, res) => {
    const _id = req.params.student_id;
    UserFlow.findOne({user: _id}, (err, userFlow) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        let stages = userFlow.stages;
        res.status(200).json({
            stages
        });
    }).populate({ path: 'stages.stage', model: Stage });
});

router.put('/updateProgress/:student_id/:flow_id/:external_id/:percentage', [verifyToken], async (req, res) => {
    const userId = req.params.student_id;
    const externalId = req.params.external_id;
    const flowId = req.params.flow_id;
    await UserFlow.findOne({user: userId}, (err, userFlow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        Stage.findOne({flow: flowId, externalId: externalId}, (err, stage) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            userFlow.stages.find(element => {
                if(element.stage.equals(stage._id)){
                    element.percentage = parseFloat(req.params.percentage);
                    if (element.percentage == 100){
                        element.active = false;
                        element.completed = true;              
                        /*If flow is sorted, check if new stages can be unlocked*/
                        if(userFlow.flow.sorted){
                            userFlow = fetchAndUpdateStages(userFlow, element.stage.step);
                        }
                        else{
                            /*If there is no more stages active, the userFlow is finished.*/
                            if(!userFlow.stages.find(stage => stage.active)){
                                userFlow.finished = true;
                            };                            
                        }
                    }
                }
            });
            userFlow.updatedAt = Date.now();
            userFlow.save((err, userFlow) => {
                if (err) {
                    return res.status(404).json({
                        err
                    });
                }
                let stages = userFlow.stages;
                res.status(200).json({
                    stages
                });
            });
        });
    }).populate({ path: 'stages.stage', model: Stage }).populate({ path: 'flow', model: Flow });
});

module.exports = router;