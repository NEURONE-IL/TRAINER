const express = require('express');
const router = express.Router();
const VideoObjects = require("../models/videoObjects");
const QuizObjects = require("../models/quizObjects");
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require("../middlewares/authMiddleware");
const imageStorage = require("../middlewares/imageStorage");
const flowMiddleware = require("../middlewares/flowMiddleware");
const Flow = require("../models/flow");
const stageMiddleware = require("../middlewares/stageMiddleware");
const Stage = require("../models/stage");
const ObjectId = require('mongodb').ObjectID;

// Return the collection 'quizObjects' as a json
router.get('', [verifyToken], async (req, res) => {
    QuizObjects.find({}, (err, data) => {
        if(err){
            return res.status(404).json({ok: false, err});
        }
        else{
            res.status(200).json({data});
            console.log(data);
        }
    })
});

// Get one quiz
router.get('/:quiz_id', async (req, res) => {
    QuizObjects.findOne({_id: req.params.quiz_id}, (err, data) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({data});
    });
});

// Add a quiz
router.post('', [verifyToken], async (req, res) => {
    const quiz = new QuizObjects({
        video_id: req.body.video_id,
        name: req.body.name,
        instructions: req.body.instructions,
        resource_url: req.body.resource_url,
        exercises: req.body.exercises
    })
    quiz.save((err, data) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            data
        });
    });
});

// Update a quiz
router.put('/:quiz_id', [verifyToken], async (req, res) => {
   const _id = req.params.quiz_id;
   const quiz = await QuizObjects.findOne({_id: _id}, (err, quiz) => {
       if (err) {
           return res.status(404).json({
               err
           });
       }
       if (req.body.video_id){
           quiz.video_id = req.body.video_id;
       }
       if (req.body.name){
           quiz.name = req.body.name;
       }
       if (req.body.instructions){
           quiz.instructions = req.body.instructions;
       }
       if (req.body.resource_url){
           quiz.resource_url = req.body.resource_url;
       }
       if (req.body.exercises){
           quiz.exercises = req.body.exercises;
       }
       quiz.updatedAt = Date.now();
       quiz.save((err, quiz) => {
           if (err) {
               return res.status(404).json({
                   err
               });
           }
           res.status(200).json({
               quiz
           });
       })
   })
});

// Delete a quiz
router.delete('/:quiz_id',  [verifyToken] , async (req, res) => {
    QuizObjects.deleteOne({_id: req.params.quiz_id}, (err, data) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            data
        });
    });
});

module.exports = router;