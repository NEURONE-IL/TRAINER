const express = require('express');
const router = express.Router();
const User = require("../models/user");
const VideoModule = require("../models/videoModule");
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require("../middlewares/authMiddleware");
const Role = require("../models/role");
const Flow = require("../models/flow");

//No workea aaaah
router.get('/:id', [verifyToken], async (req,res) => {
    const ID = req.params.id;
    console.log(ID);
    VideoModule.findOne({questionid: ID}, (err, data) => {
        if(err){
            return res.status(404).json({ok: false, err});
        }
        else{
            res.status(200).json({data});
        }
    });
});

//Pero este si mmmmmmm
router.get('', [verifyToken], async (req,res) => {
    //const questionId = req.params.questionID;
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
    console.log('routes VideoModule');
    console.log("body: ", req.body);
    const data = new VideoModule({
        questionId: req.body.questionId,
        answerQuestion: req.body.answerQuestion,
        answerBonus: req.body.answerBonus
    });
    data.save((err, data) => {
        if (err){return res.status(404).json({err});}
        else{res.status(200).json({data});}
    });
});
/*
router.post('',  [verifyToken], async (req, res) => {
    console.log('routes videoModule');
    const answer = new VideoModule({
        variablePrueba: req.body.variablePrueba
    });
    answer.save((err, answer) => {
       if (err){
           return res.status(404).json({err});
       }
       else {
           res.status(200).json({answer});
       }
    });
});
*/
module.exports = router;