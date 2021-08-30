const express = require('express');
const router = express.Router();
const UserFlow = require('../models/userFlow');
const Stage = require('../models/stage');

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

router.put('/updateProgress/:student_id/:external_id/:percentage', [verifyToken], async (req, res) => {
    const userId = req.params.student_id;
    const externalId = req.params.external_id;
    await UserFlow.findOne({user: userId}, (err, userFlow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        Stage.findOne({externalId: externalId}, (err, stage) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            userFlow.stages.find(element => {
                if(element.stage.equals(stage._id)){
                    element.percentage += parseInt(req.params.percentage); 
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
    }).populate({ path: 'stages.stage', model: Stage });
});

module.exports = router;