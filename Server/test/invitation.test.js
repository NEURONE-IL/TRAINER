process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Flow = require('../models/flow');
const User = require('../models/user');

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);
/*JWT to allow requests from registered users*/
let token1;
let token2;
let userId1;
let user2;

/*Flow data for test*/
let flowTest;

/*Invitations data for test*/

let invitationId;
let collabRequestId;
/*
@vjlh:
Test suite for Invitation API.
*/
describe('Invitation API', () => {
  /*
  @vjlh:
  Tries to authenticate the default user to get a JWT before apply each test.
  */    
  before((done) => {
    chai.request(app)
    .post('/api/auth/login')
    .send({
      email: 'user@email.com',
      password: 'user123'
    })
    .end((err, res) => {
      token2 = res.body.token;
      user2 = res.body.user;
      res.should.have.status(200);
    });

    chai.request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@admin.com',
      password: 'admin123'
    })
    .end((err, res) => {
      token1 = res.body.token;
      userId1 = res.body.user._id;
      res.should.have.status(200);

      flowTest = new Flow({
        name: 'Flow Invitation Test',
        description: 'Flow Description Test',
        sorted: true,
        user: userId1,
        privacy: false,
        collaborators: [],
        tags: ["test","invitation"],
        levels: [],
        language: "62afa06117d3cb18fb6c0a0b",
        competences: [],          
      })
      flowTest.save(async (err, flow) => {
        if(err){
          console.log(err)
        }
        await flow.populate({path:'user', model:User}).execPopulate();
        done();
      });
    })
  });

  /*
  @vjlh:
  Successful test for POST to send an invitation to collaborate route
  */
  describe('/POST invitation', () => {
    it('It should POST a invitation to collaborate', (done) => {
        let body = {
            user: user2,
            flow: flowTest           
        }
        chai.request(app)
        .post('/api/invitation/invitationToCollaborate')
        .set({ 'x-access-token': token2 })
        .send(body)
        .end((err, res) => {
            res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation to collaborate succesfully sended');
          res.body.should.have.property('invitation');
          res.body.invitation.should.have.property('user');
          res.body.invitation.should.have.property('flow');
          res.body.invitation.should.have.property('status').eql('Pendiente');
          invitationId = res.body.invitation._id;
          done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for POST route    
  */
  describe('/POST invitation', () => {
    it('It should POST a collaboration request', (done) => {
        let body = {
            user: user2,
            flow: flowTest           
        }
        chai.request(app)
        .post('/api/invitation/requestCollaboration')
        .set({ 'x-access-token': token2 })
        .send(body)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Request Collaboration succesfully sended');
            res.body.should.have.property('invitation');
            res.body.invitation.should.have.property('user');
            res.body.invitation.should.have.property('flow');
            res.body.invitation.should.have.property('status').eql('Pendiente');
            collabRequestId = res.body.invitation._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for GET checking pending invitation for a user with a flow
  */
  describe('/GET/checkExist/:userId/:flow_id invitation', () => {
    it('It should GET if there are pending invitations for the user, from a flow', (done) => {
      chai.request(app)
      .get('/api/invitation/checkExist/'+user2._id+'/'+flowTest._id)
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('EXISTING_INVITATION');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get all by user route 
  */
  describe('/GET/byUser/:userId invitation', () => {
    it('It should GET all invitations of a user', (done) => {
      chai.request(app)
      .get('/api/invitation/byUser/'+userId1)
      .set({ 'x-access-token': token1 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Invitations by user successfully get');
        res.body.should.have.property('invitations');
        res.body.invitations.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for PUT route    
  */
  describe('/PUT/rejectInvitation/:type invitation', () => {
    it('It should PUT rejected status for an invitation', (done) => {
        let type = 'collabRequest';
        let body = {
            _id: collabRequestId       
        }
        chai.request(app)
        .put('/api/invitation/rejectInvitation/'+type)
        .set({ 'x-access-token': token1 })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation succesfully rejected');
          res.body.should.have.property('invitation');
          res.body.invitation.should.have.property('user');
          res.body.invitation.should.have.property('flow');
          res.body.invitation.should.have.property('status').eql('Rechazada');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for PUT route    
  */
  describe('/PUT/acceptInvitation/:type invitation', () => {
    it('It should PUT accepted status to for an invitation', (done) => {
        let type = 'invitation';
        let body = {
            _id: invitationId       
        }
        chai.request(app)
        .put('/api/invitation/acceptInvitation/'+type)
        .set({ 'x-access-token': token1 })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation succesfully accepted');
          res.body.should.have.property('invitation');
          res.body.invitation.should.have.property('user');
          res.body.invitation.should.have.property('flow');
          res.body.invitation.should.have.property('status').eql('Aceptada');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for delete by id route 
  */
  describe('/DELETE/:id invitation', () => {
    it('It should DELETE a invitation given the id', (done) => {
      chai.request(app)
      .delete('/api/invitation/' + invitationId)
      .set({ 'x-access-token': token1 })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation successfully deleted');
      });
      chai.request(app)
      .delete('/api/invitation/' + collabRequestId)
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Invitation successfully deleted');

        Flow.deleteOne({_id: flowTest._id}, function (err, result){
          if (err){
              console.log(err)
          }
        })
        done();
      });
    });
  });
  
});