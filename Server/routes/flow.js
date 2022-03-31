const express = require('express');
const router = express.Router();
const Flow = require('../models/flow');
const Stage = require('../models/stage');

const imageStorage = require('../middlewares/imageStorage');
const authMiddleware = require('../middlewares/authMiddleware');
const flowMiddleware = require('../middlewares/flowMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('' ,  [verifyToken], async (req, res) => {
    Flow.find({}, (err, flows) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({flows});
    });
});

router.get('/:flow_id', async (req, res) => {
    const _id = req.params.flow_id;
    Flow.findOne({_id: _id}, (err, flow) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({flow});
    });
});

router.post('',  [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), flowMiddleware.verifyBody], async (req, res) => {
    let sorted = req.body.sorted === 'true' ? true : false; 
    const flow = new Flow({
        name: req.body.name,
        description: req.body.description,
        sorted: sorted
    });
    if(req.file){
        let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
        flow.image_url = image_url;
        flow.image_id = req.file.id;
    }
    flow.save((err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            flow
        });
    });
});

router.put('/:flow_id', [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), flowMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.flow_id;
    const flow = await Flow.findOne({_id: _id}, (err, flow) => {
        if (err) {
            return res.status(404).json({ 
                err
            });
        }
        if(req.body.name){
            flow.name = req.body.name;
        }
        if(req.body.description){
            flow.description = req.body.description;
        }
        if(req.body.sorted){
            flow.sorted = req.body.sorted;
        }    
        if(req.file){
            if(flow.image_id){
                imageStorage.gfs.delete(flow.image_id);
            }
            let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
            flow.image_url = image_url;
            flow.image_id = req.file.id;
        }
        flow.updatedAt = Date.now();
        flow.save((err, flow) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                flow
            });
        });
    });
});

router.delete('/:flow_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.flow_id;
    Flow.deleteOne({_id: _id}, (err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            flow
        });
    });
});

router.get('/:flow_id/getForSignup', async (req, res) => {
    const _id = req.params.flow_id;
    Flow.findOne({_id: _id}, (err, flow) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(flow) {
            if('published' in flow) {
                if(!published) {
                    return res.status(500).json({
                        ok: false,
                        msg: "FLOW_NOT_PUBLISHED"
                    });
                }
            }
            Stage.find({flow: flow.id}, (err, stages) => {
                if(err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
                if(stages.length<1) {
                    return res.status(500).json({
                        ok: false,
                        msg: "NO_STAGES_IN_FLOW"
                    });
                }
                res.status(200).json({flow: flow});
            });
        }
        else {
            return res.status(404).json({
                ok: false,
                msg: "FLOW_NOT_FOUND"
            });
        }
    });
});

module.exports = router;