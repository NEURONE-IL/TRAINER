const express = require('express');
const router = express.Router();
const Module = require('../models/module');
const Stage = require('../models/stage');

const imageStorage = require('../middlewares/imageStorage');
const authMiddleware = require('../middlewares/authMiddleware');
const moduleMiddleware = require('../middlewares/moduleMiddleware');
const verifyToken = require('../middlewares/verifyToken');

/* Para Concurrencia*/
const {EventEmitter} = require('events');
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

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
    const _user = req.params.userEdit;
    console.log(req.body)
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
        const result = module.edit.filter(x => x !== _user);
        module.edit = result;
        console.log(module.edit)

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

// Concurrencia

//Método para recibir cambios de edición de un flujo
router.get('/editStatus/:module_id/:user_id' ,async (req, res) => {
    console.log('Event Source for Module Edit Status');
    
    var Stream = new EventEmitter(); 
    const _module = req.params.module_id;       
    const _user = req.params.user_id;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    Stream.on(_user+'/'+_module, function(event, data){
        res.write('event: '+ String(event)+'\n'+'data: ' + JSON.stringify(data)+"\n\n");
    })

    var id = setInterval(async function(){
        const module = await Module.findOne({_id:_module}, (err) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        Stream.emit(_user+'/'+_module,'message',{currentUsers: module.edit});

        if(module.edit[0] == _user){
            if(module.edit.length == 1)
                Stream.removeAllListeners();
            clearInterval(id);
        }
    }, 10000); 
});

router.put('/requestEdit/:module_id'/*, [verifyToken, authMiddleware.isAdmin]*/, async (req, res) => {
    const _module = req.params.module_id;
    const _user = req.body.user;

    console.log(_user + ' arrived');
    console.log('Entering to Function: ', new Date())

    lock.acquire(_module, async function(done) {
        console.log('Entering to Lock: ', new Date())
        console.log(_user + ' acquire');
        
        const module = await Module.findOne({_id:_module}, err => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        console.log(module.edit);
        let exist = module.edit.some( id => id === _user)
        if(!exist)
            module.edit.push(_user)

        module.save(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            console.log(module.edit);
            done(module.edit);
            res.status(200).json({users: module.edit});
        })
        
    }, async function(edit) {
        const index = edit.indexOf(_user); 
        console.log('Position to edit: ', (index+1));
        console.log('Lock free...');
    })
})

router.put('/releaseModule/:module_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    console.log('Release Module')
    const _module = req.params.module_id;
    const _user = req.body.user;

    const module = await Module.findOne({_id:_module}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });

    const result = module.edit.filter(x => x !== _user);
    module.edit = result;
    console.log(module.edit)
    module.save(err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json(module);
    })
    //await delay(5); Para probar
        
})

module.exports = router;