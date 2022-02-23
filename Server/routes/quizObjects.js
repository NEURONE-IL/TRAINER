const express = require('express');
const router = express.Router();
const VideoObjects = require("../models/videoObjects");
const QuizObjects = require("../models/quizObjects");
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require("../middlewares/authMiddleware");
const imageStorage = require("../middlewares/imageStorage");
const flowMiddleware = require("../middlewares/flowMiddleware");
const Flow = require("../models/flow");
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

// Get one video
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

// Add a video
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

// Delete a video
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