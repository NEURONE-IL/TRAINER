const express = require('express');
const router = express.Router();
const Stage = require('../models/stage');
const Study = require('../models/study');

const authMiddleware = require('../middlewares/authMiddleware');
const stageMiddleware = require('../middlewares/stageMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    Stage.find({}, (err, stages) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({stages});
    });
})

router.get('/:stage_id', [verifyToken] , async (req, res) => {
    const _id = req.params.stage_id;
    Stage.findOne({_id: _id}, (err, stage) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({stage});
    });
});

router.get('/byStudy/:study_id', [verifyToken], async (req, res) => {
    const _id = req.params.study_id;
    Stage.find({study: _id}, (err, stages) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({stages});
    }).populate({ path: 'stages', model: Stage })
});

router.get('/byStudySortedByStep/:study_id', [verifyToken], async (req, res) => {
    const _id = req.params.study_id;
    Stage.find({study: _id}, (err, stages) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({stages});
    }).sort({step: 'asc'}).populate({ path: 'stages', model: Stage });
});

router.post('',  [verifyToken, authMiddleware.isAdmin, stageMiddleware.verifyBody], async (req, res) => {
    const studyId = req.body.study;
    Study.findOne({_id  : studyId}, (err, study) => {
        console.log(study)
        if (err) {
            return res.status(404).json({
                err
            });
        }
        const stage = new Stage(req.body);
        if(!study.sorted || stage.step === 1){
            stage.active = true;
        }        
        stage.save((err, stage) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                stage
            });
        });
    });
});

router.put('/:stage_id', [verifyToken, authMiddleware.isAdmin, stageMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.stage_id;
    const stage = await Stage.findOne({_id: _id}, (err, stage) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.title){
            stage.title = req.body.title;
        }
        if(req.body.description){
            study.description = req.body.description;
        }
        if(req.body.step){
            stage.step = req.body.step;
        }
        if(req.body.study){
            stage.study = req.body.study;
        }
        if(req.body.type){
            stage.type = req.body.type;
        }
        if(req.externalId){
            stage.externalId = req.body.externalId;
        }
        if(req.body.active){
            stage.active = req.body.active;
        }            
        stage.updatedAt = Date.now();
        stage.save((err, stage) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                stage
            });
        });
    });
});

router.delete('/:stage_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.stage_id;
    Stage.deleteOne({_id: _id}, (err, stage) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            stage
        });
    })
})

module.exports = router;