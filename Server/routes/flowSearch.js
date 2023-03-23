const express = require("express");
const router = express.Router();
const FlowSearch = require('../models/flowSearch');
const Flow = require('../models/flow');
const Competence = require('../models/competence');
const Language = require('../models/language');
const User = require('../models/user');
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require('../middlewares/authMiddleware');

/*
@Valentina Ligueño
TESTED: Método para realizar una búsqueda a través de una consulta
*/
router.post('/search/:user_id/:query/:page', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const query = req.params.query;
  const _id = req.params.user_id;
  const page = req.params.page;
  const totalPerPage = 8;
  const skip = page > 0 ? ( ( page - 1 ) * totalPerPage ) : 0 ;
  const notFilter = true;

  /*const filters = req.body.filters;
  const allFilters = req.body.allFilters;
  const notFilter = filters.competences.length == 0 && filters.languages.length == 0 && filters.levels.length == 0;
  
  if(filters.competences.length == 0)
    filters.competences = allFilters.competences

  if(filters.languages.length == 0)
    filters.languages = allFilters.languages

  if(filters.levels.length == 0)
    filters.levels = allFilters.levels*/

  //console.log('query', query)
  if(query != 'all' && notFilter){
    //console.log('Not Filter')
    const totalDocs = await FlowSearch.countDocuments({userID: { $ne:_id }, $text: {$search: query}});
    FlowSearch.find({userID: { $ne:_id }, $text: {$search: query}},{ score: { $meta: "textScore" } }, (err, docs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
          'message':'Flows search successfully get',
          'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});

    }).sort( { score: { $meta: "textScore" } } )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'flow', model: Flow, populate: {path:'user', model: User, select:'-password'}});
  }
  else if(query != 'all' && !notFilter){
    console.log('Filter')
    const totalDocs = await FlowSearch.countDocuments({userID: { $ne:_id },competences:{$in:filters.competences},levels:{$in:filters.levels},lang:{$in:filters.languages}, $text: {$search: query}});
    FlowSearch.find({userID: { $ne:_id },
                     competences:{$in:filters.competences},
                     levels:{$in:filters.levels},
                     lang:{$in:filters.languages},
                     $text: {$search: query}},
                    {score: { $meta: "textScore" } }, (err, docs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
          'message':'Flows search successfully get',
          'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});

    }).sort( { score: { $meta: "textScore" } } )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'flow', model: Flow, populate: {path:'user', model: User, select:'-password'}});
  }
  else if(query === 'all' && !notFilter){
    const totalDocs = await FlowSearch.countDocuments({userID: { $ne:_id }});
    FlowSearch.find({ userID: { $ne:_id },
                      competences:{$in:filters.competences},
                      levels:{$in:filters.levels},
                      lang:{$in:filters.languages}}, (err, docs) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({
        'message':'Flows search successfully get',
        'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});
    }).sort( {name:1} )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'flow', model: Flow, populate: {path:'user', model: User, select:'-password'}});
  }
  else{
    //console.log('All Not Filter')
    const totalDocs = await FlowSearch.countDocuments({userID: { $ne:_id }});
    FlowSearch.find({ userID: { $ne:_id }}, (err, docs) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({
        'message':'Flows search successfully get',
        'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});
    }).sort( {name:1} )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'flow', model: Flow, populate: {path:'user', model: User, select:'-password'}});
  }
})

/*
@Valentina Ligueño
NOT_FOR_TEST: Método para cargar los flujos públicos en el índice
*/
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
  }).populate({path:'user', model: User}).populate({path:'competences', model:Competence}).populate({path:'language', model:Language});
  
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
    flowsIndexes.push(flowSearch);
    flowSearch.save(err => {
      if(err){
          return console.log(err)
      }
    })
    if(flowsIndexes.length === flows.length) {
      res.status(200).json({flowsIndexes});
    }
  });
  
});


module.exports = router;