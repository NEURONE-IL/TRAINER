const express = require('express');
const router = express.Router();

const UserEvent = require("../models/userEvent")
const verifyToken = require('../middlewares/verifyToken')

router.post('', [verifyToken], async (req, res) => {
    const objEvent = new UserEvent({
        user: req.body.user,
        flow: req.body.flow,
        localTimeStamp: req.body.localTimeStamp
    });

    if(req.body.module){
        objEvent.module = req.body.module;
    }
    if(req.body.stage){
        objEvent.stage = req.body.stage;
    }
    if(req.body.medal){
        objEvent.medal = req.body.medal;
    }
    if(req.body.eventDescription){
        objEvent.eventDescription = req.body.eventDescription;
    }
    
    objEvent.save((err, objEvent) => {
       if (err){
           return res.status(404).json({
               err
            });
        }
       else{
            res.status(200).json({
                objEvent
            });
        }
    });
});

module.exports = router;