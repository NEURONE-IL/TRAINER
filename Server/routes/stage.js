const express = require('express');
const router = express.Router();
const Stage = require('../models/stage');
const Flow = require('../models/flow');
const Module = require('../models/module');

const imageStorage = require('../middlewares/imageStorage');
const authMiddleware = require('../middlewares/authMiddleware');
const stageMiddleware = require('../middlewares/stageMiddleware');
const verifyToken = require('../middlewares/verifyToken');

const { EventEmitter } = require('events');
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

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
    }).populate({ path: 'module', model: Module });;
});

router.get('/byFlow/:flow_id', [verifyToken], async (req, res) => {
    const _id = req.params.flow_id;
    Stage.find({flow: _id}, (err, stages) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({stages});
    }).populate({ path: 'stages', model: Stage }).populate({ path: 'module', model: Module });
});

router.get('/byFlowSortedByStep/:flow_id', [verifyToken], async (req, res) => {
    const _id = req.params.flow_id;
    Stage.find({flow: _id}, (err, stages) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({stages});
    }).sort({step: 'asc'}).populate({ path: 'stages', model: Stage }).populate({ path: 'module', model: Module });
});

router.post('',  [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), stageMiddleware.verifyBody], async (req, res) => {
    const flowId = req.body.flow;
    Flow.findOne({_id  : flowId}, (err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        const stage = new Stage({
            title: req.body.title,
            description: req.body.description,
            step: req.body.step,
            flow: flow,
            type: req.body.type,
            externalId: req.body.externalId,
            externalName: req.body.externalName,
            module: req.body.module,
            assistant: req.body.assistant
        })
        if(req.file){
            let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
            stage.image_url = image_url;
            stage.image_id = req.file.id;
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

router.put('/:stage_id', [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), stageMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.stage_id;
    const _user = req.body.userEdit;
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
            stage.description = req.body.description;
        }
        if(req.body.step){
            stage.step = req.body.step;
        }
        if(req.body.flow){
            stage.flow = req.body.flow;
        }
        if(req.body.type){
            stage.type = req.body.type;
        }
        if(req.body.externalId){
            stage.externalId = req.body.externalId;
        }
        if(req.body.externalName){
            stage.externalName = req.body.externalName;
        }        
        if(req.body.active){
            stage.active = req.body.active;
        }
        if(req.body.module){
            stage.module = req.body.module
        }
        if(req.body.assistant){
            stage.assistant = req.body.assistant;
        }
        if(req.file){
            if(stage.image_id){
                imageStorage.gfs.delete(stage.image_id);
            }
            let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
            stage.image_url = image_url;
            stage.image_id = req.file.id;
        }

        const result = stage.edit.filter(x => x !== _user);
        stage.edit = result;
        console.log(stage.edit)
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

// Concurrencia

//Método para recibir cambios de edición de un flujo
router.get('/editStatus/:stage_id/:user_id' ,async (req, res) => {
    console.log('Event Source for Stage Edit Status');
    
    var Stream = new EventEmitter(); 
    const _stage = req.params.stage_id;       
    const _user = req.params.user_id;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    Stream.on(_user+'/'+_stage, function(event, data){
        res.write('event: '+ String(event)+'\n'+'data: ' + JSON.stringify(data)+"\n\n");
    })

    var id = setInterval(async function(){
        const stage = await Stage.findOne({_id:_stage}, (err) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        Stream.emit(_user+'/'+_stage,'message',{currentUsers: stage.edit});

        if(stage.edit[0] == _user){
            if(stage.edit.length == 1)
                Stream.removeAllListeners();
            clearInterval(id);
        }
    }, 10000); 
});

router.put('/requestEdit/:stage_id'/*, [verifyToken, authMiddleware.isAdmin]*/, async (req, res) => {
    const _stage = req.params.stage_id;
    const _user = req.body.user;

    console.log(_user + ' arrived');
    console.log('Entering to Function: ', new Date())

    lock.acquire(_stage, async function(done) {
        console.log('Entering to Lock: ', new Date())
        console.log(_user + ' acquire');
        
        const stage = await Stage.findOne({_id:_stage}, err => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        console.log(stage.edit);
        let exist = stage.edit.some( id => id === _user)
        if(!exist)
            stage.edit.push(_user)

        stage.save(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            console.log(stage.edit);
            done(stage.edit);
            res.status(200).json({users: stage.edit});
        })
        
    }, async function(edit) {
        const index = edit.indexOf(_user); 
        console.log('Position to edit: ', (index+1));
        console.log('Lock free...');
    })
})

router.put('/releaseStage/:stage_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    console.log('Release Stage')
    const _stage = req.params.stage_id;
    const _user = req.body.user;

    const stage = await Stage.findOne({_id:_stage}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });

    const result = stage.edit.filter(x => x !== _user);
    stage.edit = result;
    console.log(stage.edit)
    stage.save(err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json(stage);
    })
        
})

module.exports = router;