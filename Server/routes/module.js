const express = require('express');
const router = express.Router();
const Module = require('../models/module');
const Stage = require('../models/stage');

const imageStorage = require('../middlewares/imageStorage');
const authMiddleware = require('../middlewares/authMiddleware');
const moduleMiddleware = require('../middlewares/moduleMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('' ,  [verifyToken], async (req, res) => {
    Module.find({}, (err, modules) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({modules});
    });
});

router.get('/:module_id', async (req, res) => {
    const _id = req.params.module_id;
    Module.findOne({_id: _id}, (err, module) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({module});
    });
});


router.get('/byFlow/:flow_id', [verifyToken], async (req, res) => {
    const _id = req.params.flow_id;
    const stages = await Stage.find({flow: _id}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });
    Module.find({flow: _id}, (err, modules) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        modules = JSON.parse(JSON.stringify(modules))
        for(let i = 0; i<modules.length; i++){
            let array = []
            for(let j = 0; j<stages.length; j++){
                if(stages[j].module.equals(modules[i]._id)){
                    array.push(stages[j]);
                    stages.splice(j, 1);
                    j--;
                }
            }
            modules[i]["stages"] = array;
        }
        res.status(200).json({modules});
    }).populate({ path: 'modules', model: Module });
});

router.post('',  [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), moduleMiddleware.verifyBody], async (req, res) => {
    const module = new Module({
        name: req.body.name,
        description: req.body.description,
        code: req.body.code,
        flow: req.body.flow
    });
    if(req.file){
        let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
        module.image_url = image_url;
        module.image_id = req.file.id;
    }
    module.save((err, module) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            module
        });
    });
});

router.put('/:module_id', [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), moduleMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.module_id;
    const module = await Module.findOne({_id: _id}, (err, module) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.name){
            module.name = req.body.name;
        }
        if(req.body.description){
            module.description = req.body.description;
        }
        if(req.body.code){
            module.code = req.body.code;
        }     
        if(req.body.flow){
            module.flow = req.body.flow;
        }    
        if(req.file){
            if(module.image_id){
                imageStorage.gfs.delete(module.image_id);
            }
            let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
            module.image_url = image_url;
            module.image_id = req.file.id;
        }
        module.updatedAt = Date.now();
        module.save((err, module) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                module
            });
        });
    });
});

router.delete('/:module_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.module_id;
    Module.deleteOne({_id: _id}, (err, module) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            module
        });
    });
});

module.exports = router;