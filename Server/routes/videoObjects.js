const express = require('express');
const router = express.Router();
const VideoObjects = require("../models/videoObjects");
const verifyToken = require('../middlewares/verifyToken');
const ObjectId = require('mongodb').ObjectID;

router.get('', [verifyToken], async (req, res) => {
    VideoObjects.find({}, (err, data) => {
        if(err){
            return res.status(404).json({ok: false, err});
        }
        else{
            res.status(200).json({data});
        }
    })
});

module.exports = router;