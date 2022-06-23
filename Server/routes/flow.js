const express = require('express');
const router = express.Router();
const Flow = require('../models/flow');
const FlowSearch = require('../models/flowSearch');
const User = require('../models/user');
const Competence = require('../models/competence');
const Language = require('../models/language');
const Module = require('../models/module');
const Stage = require('../models/stage');
const History = require('../models/history');
const Invitation = require('../models/invitation');
const AdminNotification = require('../models/adminNotification');
const QuizObjects = require('../models/quizObjects');

const imageStorage = require('../middlewares/imageStorage');
const authMiddleware = require('../middlewares/authMiddleware');
const flowMiddleware = require('../middlewares/flowMiddleware');
const verifyToken = require('../middlewares/verifyToken');

/* Para Concurrencia*/
const {EventEmitter} = require('events');
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

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
    flow.save(async (err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }        
        if(flow.privacy == false){
            await flow.populate({path:'user', model:User}).populate({path:'competences', model:Competence}).populate({path:'language', model:Language}).execPopulate();
            createFlowSearch(flow);
        }
        res.status(200).json({
            flow
        });
    });
});

//Editar un flujo
router.put('/:flow_id', [verifyToken, authMiddleware.isAdmin, imageStorage.upload.single('file'), flowMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.flow_id;
    const _user = req.params.userEdit;

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
        const result = flow.edit.filter(x => x !== _user);
        flow.edit = result;
        flow.updatedAt = Date.now();
        flow.save(async (err, flow) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            await flow.populate({path:'user', model:User}).populate({path:'competences', model:Competence}).populate({path:'language', model:Language}).execPopulate();

            if(flow.privacy == true && privacyChange)
              deleteFlowSeach(flow._id);
            else if(flow.privacy == false && privacyChange)
              createFlowSearch(flow);
            else if(flow.privacy == false && !privacyChange)
              updateFlowSearch(flow);

            res.status(200).json({
                flow
            });
        });
    });
});

router.delete('/:flow_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.flow_id;
    Flow.findOneAndDelete({_id: _id}, (err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(flow.privacy === false)
          deleteStudySeach(_id);
        
        deleteInvitations(flow,res);
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

//Método para editar los colaboradores de un flujo
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
                description:'Invitación para colaborar en el flujo: ' + flow.name,
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

router.get('/clone/:flow_id/user/:user_id/', [verifyToken], async (req, res) => {
    const _id = req.params.flow_id;
    const _user = req.params.user_id;
    const flow = await Flow.findOne({_id: _id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });

    const modules = await Module.find({flow: flow._id}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })
    const cloneFlow = new Flow({
        name: flow.name+' (clonado)',
        description: flow.description,
        sorted: flow.sorted,

        privacy: true,
        tags: flow.tags,
        levels: flow.levels,
        language: flow.language,
        competences: flow.competences,
        user: _user,
        collaborators: [],
        type: 'clone',

    });

    modules.forEach(async module => {
        let newModule = new Module({
            flow: cloneFlow._id,
            name: module.name,
            description: module.description,
            image_url: module.image_url,
            image_id: module.image_id
        })
        const stages = await Stage.find({module: module._id}, err => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        })
        stages.forEach(async stage => {
            let newStage = new Stage({
                title: stage.title,
                description:stage.description,
                step: stage.step,
                flow: cloneFlow._id,
                module: newModule._id,
                assistant: stage.assistant,
                type: stage.type,
                externalId: stage.externalId,
                externalName: stage.externalName,
                image_url: stage.image_url,
                image_id: stage.image_id,
            })

            newStage.save(err => {
                if(err){
                    return res.status(404).json({
                        err
                    });
                }
            })
        })
        
        newModule.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
        
    });
    

    let copyHistory = new History({
        user: _user,
        flow: _id,
        type: 'clone',
        description: 'The flow was cloned'
    })
    copyHistory.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    const userClone = await User.findOne({_id: _user},{password:0}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });
    const notification = new AdminNotification ({
        userFrom:userClone,
        userTo: flow.user,
        type: 'clone',
        history: copyHistory._id,
        description:userClone.names + ' ' +userClone.last_names + ' ha clonado su flujo: ' + flow.name,
        seen: false,
    });
    notification.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })

    cloneFlow.save((err, flow) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            flow
        });
    })
})

// Concurrencia

//Método para recibir cambios de edición de un flujo
router.get('/editStatus/:flow_id/:user_id' ,async (req, res) => {
    console.log('Event Source for Flow Edit Status');
    
    var Stream = new EventEmitter(); 
    const _flow = req.params.flow_id;       
    const _user = req.params.user_id;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    Stream.on(_user+'/'+_flow, function(event, data){
        res.write('event: '+ String(event)+'\n'+'data: ' + JSON.stringify(data)+"\n\n");
    })

    var id = setInterval(async function(){
        const flow = await Flow.findOne({_id:_flow}, (err) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        Stream.emit(_user+'/'+_flow,'message',{currentUsers: flow.edit});

        if(flow.edit[0] == _user){
            if(flow.edit.length == 1)
                Stream.removeAllListeners();
            clearInterval(id);
        }
    }, 10000); 
});

router.put('/requestEdit/:flow_id'/*, [verifyToken, authMiddleware.isAdmin]*/, async (req, res) => {
    const _flow = req.params.flow_id;
    const _user = req.body.user;

    console.log(_user + ' arrived');
    console.log('Entering to Function: ', new Date())

    lock.acquire(_flow, async function(done) {
        console.log('Entering to Lock: ', new Date())
        console.log(_user + ' acquire');
        
        const flow = await Flow.findOne({_id:_flow}, err => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        });
        console.log(flow)
        let exist = flow.edit.some( id => id === _user)
        if(!exist)
            flow.edit.push(_user)

        flow.save(err => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            done(flow.edit);
            res.status(200).json({users: flow.edit});
        })
        //await delay(5); //Para probar
        
    }, async function(edit) {
        console.log(edit)
        const index = edit.indexOf(_user); 
        console.log('Position to edit: ', (index+1));
        console.log('Lock free...');
    })
})

router.put('/releaseFlow/:flow_id', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    console.log('Release Flow')
    const _flow = req.params.flow_id;
    const _user = req.body.user;

    const flow = await Flow.findOne({_id:_flow}, err => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    });

    const result = flow.edit.filter(x => x !== _user);
    flow.edit = result;
    console.log(flow.edit)
    flow.save(err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json(flow);
    })
        
})

async function deleteFlowSeach(flow_id){
    console.log('deleteFlowSeach');
    try {
      const _flow = flow_id;
      //Encontrar el flowSearch
      await FlowSearch.deleteOne({flow:_flow}, err =>{
          if(err){
          console.log(err);
        }
      });
    }
    catch (err) {
          console.log(err);
     }
  };
  
async function updateFlowSearch(flow){
    console.log('updateFlowSearch');
    try {
        const _flow = flow._id;
        //Encontrar el flowSearch
        const flowSearch = await FlowSearch.findOne({flow:_flow}, err =>{
            if(err){
                console.log(err);
            }
        });
        let competences = [];
        await flow.competences.forEach( comp => {
            competences.push(comp.name)
        })

        flowSearch.name = flow.name;
        flowSearch.description= flow.description;
        flowSearch.tags= flow.tags;
        flowSearch.levels= flow.levels;
        flowSearch.lang= flow.language.name;
        flowSearch.competences= competences;

        flowSearch.save(err => {
            if(err){
                console.log(err)
            }
        })
    }catch (err) {
        console.log(err)
    }
  };
  
async function createFlowSearch(flow){
    console.log('createFlowSearch');
  
    try {
      let competences = [];
        await flow.competences.forEach( comp => {
            competences.push(comp.name)
        })
      const flowSearch = new FlowSearch({
        name: flow.name,
        author: flow.user.names + ' '+ flow.user.last_names,
        description: flow.description,
        tags: flow.tags,
        userID: flow.user._id,
        levels: flow.levels,
        lang: flow.language.name,
        competences: competences,
        //challenges: challengeArr,
        flow: flow
      })
      flowSearch.save(err => {
        if(err){
          console.log(err);
        }
      })
    }
    catch (err) {
      console.log(err);
    }
  };

  async function deleteInvitations(flow, res){
    const invitations = await Invitation.find({flow:flow, status: 'Pendiente'}, err =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
    });
  
    if(invitations.length > 0){
      invitations.forEach(async invitation => {
        await AdminNotification.deleteOne({invitation: invitation._id}, err => {
          if (err) {
            return res.status(404).json({
                err
            });
          }
        })
        await Invitation.deleteOne({_id:invitation._id}, err => {
          if (err) {
            return res.status(404).json({
                err
            });
          }
        })
    
      })
    }
  }

module.exports = router;