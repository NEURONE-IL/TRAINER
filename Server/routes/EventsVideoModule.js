const express = require('express');
const router = express.Router();
const User = require("../models/user");
const VideoModule = require("../models/videoModule");
const EventsVideoModule = require("../models/eventsVideoModule");
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require("../middlewares/authMiddleware");
const Role = require("../models/role");
const Flow = require("../models/flow");
const ObjectId = require('mongodb').ObjectID;


router.post('', [verifyToken], async (req, res) => {
    console.log("BDD?");
   const data = new EventsVideoModule({
       userId: ObjectId(req.body.userId),
       component: req.body.component,
       event: req.body.event
   });
   data.save((err, data) => {
       if (err){return res.status(404).json({err});}
       else{res.status(200).json({data});}
   });
});

module.exports = router;