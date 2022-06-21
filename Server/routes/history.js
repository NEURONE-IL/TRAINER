const express = require('express');
const router = express.Router();
const History = require('../models/history');
const User = require('../models/user');
const Flow = require('../models/flow');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

//Traer todo el historial
router.get('' , [verifyToken, authMiddleware.isAdmin],async (req, res) => {
  History.find({}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  });
})

//Traer todo el historial de un usuario

router.get('/byUser/:user_id' ,  [verifyToken], async (req, res) => {
  const _id = req.params.user_id;
  History.find({user: _id}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'flow', model: Flow});
})

//Traer todo el historial de un usuario según el tipo de registro

router.get('/byUserByType/:user_id/:type' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const _id = req.params.user_id;
  const type = req.params.type;

  History.find({user: _id, type: type}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'flow', model: Flow});
})

//Traer todo el historial relacionado a un estudio

router.get('/byFlow/:flow_id' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const _id = req.params.flow_id;
  History.find({flow: _id}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'flow', model: Flow})
})

//Traer todo el historial relacionado a un estudio según el tipo de registro

router.get('/byFlowByType/:flow_id/:type' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const _id = req.params.flow_id;
  const type = req.params.type;

  History.find({flow: _id, type: type}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'flow', model: Flow});
})

router.post('',  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const history = new History(req.body);
  history.save((err, history) => {
      if (err) {
          return res.status(404).json({
              err
          });
      }
      res.status(200).json({
          history
      });
  })
});

module.exports = router;