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
router.get('/:questionId', [verifyToken], async (req,res) => {
    VideoModule.findOne({questionId: req.params.questionId}, (err, data) => {
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

router.put('/:questionId', [verifyToken], async (req, res) => {
    const id = req.params.questionId;
    const answer = await VideoModule.findOne({questionId: id}, (err, answer) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.userId){
            answer.userId = req.body.userId;
        }
        /*if(req.body.flow){
            answer.flow = req.body.flow;
        }
        if(req.body.stageId){
            answer.stageId = req.body.stageId;
        }*/
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