process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Flow = require('../models/flow');

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;
let userId;

/*
@vjlh:
Test suite for History Clone API.
*/
describe('History Clone API', () => {
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
      token = res.body.token;
      userId = res.body.user._id;
      res.should.have.status(200);
      done();
    });
  });
  
  /*
  @vjlh:
  Successful test for get all route 
  */
  describe('/GET/ History', () => {
    it('It should GET all history clone', (done) => {
      chai.request(app)
      .get('/api/history/')
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Clone history successfully get');
        res.body.should.have.property('histories');
        res.body.histories.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get all by user route 
  */
  describe('/GET/:userId History', () => {
    it('It should GET all history from a specific user', (done) => {
      chai.request(app)
      .get('/api/history/byUser/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Clone history by user successfully get');
        res.body.should.have.property('histories');
        res.body.histories.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get all clone by flow route 
  */
  describe('/GET/byFlowByType/:flowId/:type History', () => {
    it('It should GET all history clone for a flow', (done) => {
      let type = 'clone';
      Flow.findOne({user:userId}, function (err, flow){
        if (err){
            console.log(err)
        }
        chai.request(app)
        .get('/api/history/byFlowByType/'+flow._id+'/'+type)
        .set({ 'x-access-token': token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Clone History by flow successfully get');
          res.body.should.have.property('histories');
          res.body.histories.should.be.a('array');
          done();
        });
      })
    });
  });


});