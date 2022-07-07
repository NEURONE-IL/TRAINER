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
let flowTest;
let invitationId;

/*
@vjlh:
Test suite for Invitation API.
*/
describe('Invitation API', () => {
  /*
  @vjlh:
  Tries to authenticate the default user to get a JWT before apply each test.
  */    
  beforeEach((done) => {
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
      });

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

        Flow.findOne({user:userId1}, async (err, flow) => {
          if (err){
              console.log(err)
          }
          await flow.populate({path:'user', model:User}).execPopulate();
          flowTest = flow;
          done();
        });
      });

  });
  /*
  @vjlh:
  Successful test for POST route    
  */
  describe('/POST invitation', () => {
    it('It should POST a invitation', (done) => {
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
            invitationId = res.body.invitation._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for GET checking pending invitation for a user with a flow
  */
  describe('/GET/checkExist/:userId/:flow_id Invitation', () => {
    it('It should GET if exist pending invitation for a flow by a user', (done) => {
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
  describe('/GET/byUser/:userId Invitation', () => {
    it('It should GET all invitations from a specific user', (done) => {
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
  describe('/PUT/acceptInvitation/:type Invitation', () => {
    it('It should PUT accepted status to a invitation', (done) => {
        let type = 'collabRequest';
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
  Successful test for PUT route    
  */
  describe('/PUT/rejectInvitation/:type Invitation', () => {
    it('It should PUT rejected status to a invitation', (done) => {
        let type = 'collabRequest';
        let body = {
            _id: invitationId       
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
  Successful test for delete by id route 
  */
  describe('/DELETE/:invitationId invitation', () => {
    it('It should DELETE a invitation given the id', (done) => {
      chai.request(app)
      .delete('/api/invitation/' + invitationId)
      .set({ 'x-access-token': token1 })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation successfully deleted');
        done();
      });
    });
  });
  
});