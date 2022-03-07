const express = require('express');
const router = express.Router();
const User = require("../models/user");
const VideoModule = require("../models/videoModule");
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require("../middlewares/authMiddleware");
const Role = require("../models/role");
const Flow = require("../models/flow");
const ObjectId = require('mongodb').ObjectID;

// para llamar url -> http://localhost:3070/api/videoModule/001001001
// Falta filtrar por flowid y stageid y userID
router.get('/:questionId/:userId/:stageId/:flowId', [verifyToken], async (req,res) => {
    const questionId = req.params.questionId;
    const userId = req.params.userId;
    const stageId = req.params.stageId;
    const flowId = req.params.flowId;
    VideoModule.findOne({questionId: questionId, userId: userId, stageId: stageId, flowId: flowId}, (err, data) => {
        if(err){
            return res.status(404).json({ok: false, err});
        }
        else{
            res.status(200).json({data});
        }
    });
});

router.get('/:questionId', [verifyToken], async (req,res) => {
    const questionId = req.params.questionId;
    const userId = req.params.userId;
    const stageId = req.params.stageId;
    const flowId = req.params.flowId;
    VideoModule.findOne({questionId: questionId}, (err, data) => {
        if(err){
            return res.status(404).json({ok: false, err});
        }
        else{
            res.status(200).json({data});
        }
    });
});

router.get('', [verifyToken], async (req,res) => {
    VideoModule.find({}, (err, data) => {
        if(err){
            return res.status(404).json({ok: false, err});
        }
        else{
            res.status(200).json({data});
        }
    });
});

router.post('', [verifyToken], async (req, res) => {
    const data = new VideoModule({
        userId: ObjectId(req.body.userId),
        stageId: ObjectId(req.body.stageId),
        flowId: ObjectId(req.body.flowId),
        questionId: req.body.questionId,
        questionType: req.body.questionType,
        answerQuestion: req.body.answerQuestion,
        answerBonus: req.body.answerBonus
    });
    data.save((err, data) => {
        if (err){return res.status(404).json({err});}
        else{res.status(200).json({data});}
    });
});


router.put('/:questionId/:userId/:stageId/:flowId', [verifyToken], async (req, res) => {
    const questionId = req.params.questionId;
    const userId = req.params.userId;
    const stageId = req.params.stageId;
    const flowId = req.params.flowId;
    const answer = await VideoModule.findOne({questionId: questionId, userId: userId, stageId: stageId, flowId: flowId}, (err, answer) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.userId){
            answer.userId = req.body.userId;
        }
        if(req.body.flow){
            answer.flowId = req.body.flowId;
        }
        if(req.body.stageId){
            answer.stageId = req.body.stageId;
        }
        if(req.body.questionId){
            answer.questionId = req.body.questionId;
        }
        if(req.body.questionType){
            answer.questionType = req.body.questionType;
        }
        if(req.body.answerQuestion){
            answer.answerQuestion = req.body.answerQuestion;
        }
        if(req.body.answerBonus){
            answer.answerBonus = req.body.answerBonus;
        }
        answer.updatedAt = Date.now();
        answer.save((err, answer) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                answer
            });
        });
    });
});

module.exports = router;