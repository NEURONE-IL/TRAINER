const express = require("express");
const router = express.Router();
const FlowSearch = require('../models/flowSearch');
const Flow = require('../models/flow');
const User = require('../models/user');
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/search/:user_id/:query/:page', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const query = req.params.query;
  const _id = req.params.user_id;
  
  const page = req.params.page;
  const totalPerPage = 8;
  const skip = page > 0 ? ( ( page - 1 ) * totalPerPage ) : 0 ;
  console.log('query', query)
  if(query != 'all'){
    const totalDocs = await FlowSearch.countDocuments({userID: { $ne:_id }, $text: {$search: query}});
    FlowSearch.find({userID: { $ne:_id }, $text: {$search: query}},{ score: { $meta: "textScore" } }, (err, docs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});

    }).sort( { score: { $meta: "textScore" } } )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'flow', model: Flow, populate: {path:'user', model: User, select:'-password'}});
  }
  else{
    const totalDocs = await FlowSearch.countDocuments({userID: { $ne:_id }});
    FlowSearch.find({userID: { $ne:_id }}, (err, docs) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});
    }).sort( {name:1} )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'flow', model: Flow, populate: {path:'user', model: User, select:'-password'}});
  }
})

router.post('/loadFlows', /*[verifyToken, authMiddleware.isAdmin],*/ async (req, res) => {
  console.log('load Flows')
  let flowsIndexes = []
  const flows = await Flow.find({privacy:false}, err =>{
    if(err){
        return res.status(404).json({
            ok: false,
            err
        });
    }
  }).populate({path:'user', model: User});
  
  await flows.forEach(async flow => {
    const _flow_id = flow._id;
    /*const challenges = await Challenge.find({flow:_flow_id}, err => {
      if(err){
        return res.status(404).json({
            ok: false,
            err
        });
      }
    })

    let challengeArr = [];

    await challenges.forEach( challenge => {
      challengeArr.push(challenge.question)
    })*/
    const flowSearch = new FlowSearch({
      name: flow.name,
      author: flow.user.names + ' '+ flow.user.last_names,
      description: flow.description,
      tags: flow.tags,
      userID: flow.user._id,
      //challenges: challengeArr,
      flow: flow
    })
    flowsIndexes.push(flowSearch);
    flowSearch.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    if(flowsIndexes.length === flows.length) {
      res.status(200).json({flowsIndexes});

    }
  });
  
});


module.exports = router;