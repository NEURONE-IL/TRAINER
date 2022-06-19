const express = require('express');
const router = express.Router();
const Flow = require('../models/flow');
const User = require('../models/user');
const Competence = require('../models/competence');

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
    }).populate({
        path: 'collaborators',
        populate: {
          path: 'user',
          model: User,
          select:'-password' 
        }
      }).populate({path: 'user', model: User, select:'-password'}).populate({path: 'competences', model: Competence});
});

//Valentina

//Método para obtener solo flujos privados o públicos de un usuario
router.get('/byUserbyPrivacy/:user_id/:privacy', [verifyToken], async (req, res) => {
    const _privacy = JSON.parse(req.params.privacy);
    const _id = req.params.user_id; 
    
    Flow.find({user: _id, privacy: _privacy}, (err, flows) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }

        res.status(200).json({flows});
    })
});

//Método para obtener los flujos por tipo de un usuario
router.get('/byUserbyType/:user_id/:type', [verifyToken] ,async (req, res) => {
    const type = req.params.type;
    const _id = req.params.user_id; 
    
    Flow.find({user: _id, type: type}, (err, flows) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }

        res.status(200).json({flows});
    })
});

//Método para obtener flujos privados o públicos
router.get('/byPrivacy/:flow_privacy/:user_id', [verifyToken] ,async (req, res) => {
    const _privacy = req.params.flow_privacy;
    const _id = req.params.user_id
    Flow.find({
                privacy: _privacy,
                user: { $ne:_id }
                }, (err, flows) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({flows});
    }).populate({ path: 'user', model: User, select:'-password'})
});

//Método para obtener los flujos de un usuario en específico
router.get('/byUser/:user_id', [verifyToken], async (req, res) => {
    const _id = req.params.user_id;
    Flow.find({user: _id}, (err, flows) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({flows});
    })
});

//Método para obtener los flujos de colaboración de un usuario en específico
router.get('/byUserCollaboration/:user_id', [verifyToken], async (req, res) => {
    const _id = req.params.user_id;
    
    Flow.find({"collaborators": { 
                  $elemMatch: {
                    user:_id,
                    invitation:'Aceptada'
                  }
                }}, (err, flows) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            })
        }
        res.status(200).json({flows});
    }).populate({ path: 'user', model: User, select:'-password'});
});

router.post('',  [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), flowMiddleware.verifyBody], async (req, res) => {
    let sorted = req.body.sorted === 'true' ? true : false; 
    let collaborators = JSON.parse(req.body.collaborators);
    let tags = JSON.parse(req.body.tags);
    let levels = JSON.parse(req.body.levels);
    let competences = JSON.parse(req.body.competences);

    console.log(collaborators);

    const flow = new Flow({
        name: req.body.name,
        description: req.body.description,
        sorted: sorted,

        user: req.body.user,
        privacy: req.body.privacy,
        type: 'own',
        collaborators: collaborators,
        tags: tags,
        levels: levels,
        language: req.body.language,
        competences: competences,
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

//Editar un flujo
router.put('/:flow_id', [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), flowMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.flow_id;
    console.log(req.body)
    const flow = await Flow.findOne({_id: _id}, (err, flow) => {
        if (err) {
            return res.status(404).json({ 
                err
            });
        }
        var privacyChange = false;

        if(req.body.name){
            flow.name = req.body.name;
        }
        if(req.body.description){
            flow.description = req.body.description;
        }
        if(req.body.sorted){
            flow.sorted = req.body.sorted;
        }

        let privacy = JSON.parse(req.body.privacy);
        console.log(privacy);
        
        if(flow.privacy == privacy)
            privacyChange = false;

        else {
            flow.privacy = privacy
            privacyChange = true;
        }
        //console.log(privacyChange)
              
        if(req.body.collaborators){
            let collaborators = JSON.parse(req.body.collaborators);
            flow.collaborators = collaborators;
        }
        if(req.body.tags){
            let tags = JSON.parse(req.body.tags);
            flow.tags = tags;
        }
        if(req.body.levels){
            let levels = JSON.parse(req.body.levels);
            flow.levels = levels;
        } 
        if(req.body.competences){
            let competences = JSON.parse(req.body.competences);
            flow.competences = competences;
        } 
        if(req.body.language){
            flow.language = req.body.language;
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

//Método para editar los colaboradores de un estudio
router.put('/editCollaborators/:flow_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    
    const _id = req.params.flow_id;

    const flow = await Flow.findOne({_id: _id}, (err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })
    let collaborators = req.body.collaborators;
    /*if(collaborators){
        flow.collaborators.forEach(async coll => {
            //Si el colaborador actual del loop no se encuentra en la lista de colaboradores
            let collDelete = collaborators.some(item => JSON.stringify(item.user._id) === JSON.stringify(coll.user));

            if(!collDelete && coll.invitation === 'Pendiente'){

                console.log('borra')
                await Invitation.findOneAndDelete({user: coll.user, status: 'Pendiente', flow: flow._id}, async (err, inv) =>{
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }
                    await AdminNotification.deleteOne({invitation: inv._id}, err =>{
                        if(err){
                            return res.status(404).json({
                                ok: false,
                                err
                            });
                        }
                    })
                })
                
                
            }
        });
        collaborators.forEach((coll, i) => {
            let index = flow.collaborators.findIndex(item => item.user == coll.user._id);

            if(!(index >= 0)){
                const invitation = new Invitation ({
                    user: coll.user,
                    flow: flow,
                    status: 'Pendiente',
                });
                invitation.save(err => {
                    if(err){
                        return res.status(404).json({
                            err
                        });
                    }
                })
                const notification = new AdminNotification ({
                    userFrom:flow.user,
                    userTo: coll.user,
                    type: 'invitation',
                    invitation: invitation,
                    description:'Invitación para colaborar en el estudio: ' + flow.name,
                    seen: false,
                });
                notification.save(err => {
                    if(err){
                        return res.status(404).json({
                            err
                        });
                    }
                })
            }
            if(i === (collaborators.length-1))
              flow.collaborators = req.body.collaborators
        })
    }*/

    flow.collaborators = collaborators;
    flow.updatedAt = Date.now();

    await flow.save(async (err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        await flow.populate({
            path: 'collaborators',
            populate: {
              path: 'user',
              model: User,
              select:'-password' 
            }
          }).populate({path: 'user', model: User, select:'-password'}).execPopulate()
        res.status(200).json({
            flow
        });
    })
})

module.exports = router;