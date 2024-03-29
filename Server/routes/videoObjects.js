const express = require('express');
const router = express.Router();
const VideoObjects = require("../models/videoObjects");
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require("../middlewares/authMiddleware");
const imageStorage = require("../middlewares/imageStorage");
const flowMiddleware = require("../middlewares/flowMiddleware");
const Flow = require("../models/flow");
const ObjectId = require('mongodb').ObjectID;

// Return the collection 'videoObjects' as a json
router.get('', [verifyToken], async (req, res) => {
    VideoObjects.find({}, (err, data) => {
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
router.get('/:video_id', async (req, res) => {
    VideoObjects.findOne({_id: req.params.video_id}, (err, data) =>{
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
    const video = new VideoObjects({
        name: req.body.name,
        image_url: req.body.image_url,
        video_url: req.body.video_url,
        language: req.body.language
    })
    video.save((err, data) => {
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
router.delete('/:video_id',  [verifyToken] , async (req, res) => {
    VideoObjects.deleteOne({_id: req.params.video_id}, (err, data) => {
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