process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Study = require('../models/flow');

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;
let userId;
let flowId;

/*
@vjlh:
Test suite for Study API New Implementations.
*/
describe('Study API New Implementations', () => {
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
  Successful test for POST route    
  */
  describe('/POST flow', () => {
    it('It should POST a flow', (done) => {
      let flowTestBody = {
        name: 'Flow Creation Test',
        description: 'Flow Description Test',
        sorted: true,
        user: userId,
        privacy: false,
        collaborators: '[]',
        tags: '["test","create"]',
        levels: '[]',
        language: "62afa06117d3cb18fb6c0a0b",
        competences: '[]',         
      }
      chai.request(app)
      .post('/api/flow/')
      .set({ 'x-access-token': token })
      .send(flowTestBody)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flow successfully post');
        res.body.should.have.property('flow');
        res.body.flow.should.have.property('name');
        res.body.flow.should.have.property('description');
        res.body.flow.should.have.property('sorted');
        res.body.flow.should.have.property('user');
        res.body.flow.should.have.property('collaborators');
        res.body.flow.should.have.property('privacy');
        res.body.flow.should.have.property('type');
        res.body.flow.should.have.property('tags');
        res.body.flow.should.have.property('levels');
        res.body.flow.should.have.property('competences');
        res.body.flow.should.have.property('language');
        res.body.flow.should.have.property('edit');
        flowId = res.body.flow._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get by user route 
  */
  describe('/GET/byUser/:userId Flows by User', () => {
    it('It should GET all flows of a particular user', (done) => {
      chai.request(app)
      .get('/api/flow/byUser/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Flows by user successfully get');
          res.body.should.have.property('flows');
          res.body.flows.should.be.a('array');
      done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for get by user by privacy route 
  */
  describe('/GET/byUserbyPrivacy/:userId/:privacy Studies by User', () => {
    it('It should GET all flows of a particular user filtered by privacy (public / private)', (done) => {
      chai.request(app)
      .get('/api/flow/byUserbyPrivacy/'+userId+'/true')
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Flows by user by privacy successfully get');
          res.body.should.have.property('flows');
          res.body.flows.should.be.a('array');
      done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for get by type route 
  */
  describe('/GET/byUserbyType/:userId/:type flows by User', () => {
    it('It should GET all flows of a particular user filtered by type (cloned / own)', (done) => {
      chai.request(app)
      .get('/api/flow/byUserbyType/'+userId+'/own')
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Flows by user by type successfully get');
          res.body.should.have.property('flows');
          res.body.flows.should.be.a('array');
      done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get by user for collaboration 
  */
  describe('/GET/byUserCollaboration/:userId/ flows by User', () => {
    it('It should GET all flows of a particular user in which is collaborator', (done) => {
      chai.request(app)
      .get('/api/flow/byUserCollaboration/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Flows by user in which is collaborator successfully get');
        res.body.should.have.property('flows');
        res.body.flows.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get by privacy route 
  */
  describe('/GET/byPrivacy/:privacy/:userId Flows by User', () => {
    it('It should GET all flows filtered by privacy (public / private) except logged user is owner', (done) => {
      chai.request(app)
      .get('/api/flow/byPrivacy/false/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Flows by privacy successfully get');
        res.body.should.have.property('flows');
        res.body.flows.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get cloning route 
  */
  describe('/GET/copy/:flowId/user/:userId study', () => {
    it('It should GET a generated cloned study', (done) => {
      chai.request(app)
      .get('/api/flow/clone/'+flowId+'/user/'+userId+'/')
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flow successfully clone');
        res.body.should.have.property('flow');
        res.body.flow.should.have.property('name');
        res.body.flow.should.have.property('description');
        res.body.flow.should.have.property('sorted');
        res.body.flow.should.have.property('user').eql(userId);;
        res.body.flow.should.have.property('collaborators');
        res.body.flow.should.have.property('privacy');
        res.body.flow.should.have.property('type').eql('clone');;
        res.body.flow.should.have.property('tags');
        res.body.flow.should.have.property('levels');
        res.body.flow.should.have.property('competences');
        res.body.flow.should.have.property('language');
        res.body.flow.should.have.property('edit');

        Study.deleteOne({_id: res.body.flow._id}, function (err, result){
          if (err){
              console.log(err)
          }
        })
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put request for edit route 
  */
  describe('/PUT/requestEdit/:flowId flow', () => {
    it('It should PUT edit list of a flow to give a user edit permission', (done) => {
      let body = {
        user: userId
      }
      chai.request(app)
      .put('/api/flow/requestEdit/'+flowId)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Edit list successfully updated');
        res.body.should.have.property('users');
        res.body.users.should.be.a('array');
        res.body.users.length.should.be.eql(1);
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put route 
  */
  describe('/PUT/:flowId flow', () => {
    it('It should PUT a flow', (done) => {
      let flowPutTestBody = {
        name: 'Flow Updated Creation Test',
        description: 'Flow Updated Description Test',
        sorted: true,
        user: userId,
        privacy: true,
        collaborators: '[]',
        tags: '["test","create","update"]',
        levels: '[]',
        language: "62afa06117d3cb18fb6c0a0b",
        competences: '[]',         
      }
        chai.request(app)
        .put('/api/flow/'+flowId)
        .set({ 'x-access-token': token })
        .send(flowPutTestBody)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Flow succesfully updated');
          res.body.should.have.property('flow');
          res.body.flow.should.have.property('name');
          res.body.flow.should.have.property('description');
          res.body.flow.should.have.property('sorted');
          res.body.flow.should.have.property('user');
          res.body.flow.should.have.property('collaborators');
          res.body.flow.should.have.property('privacy');
          res.body.flow.should.have.property('type');
          res.body.flow.should.have.property('tags');
          res.body.flow.should.have.property('levels');
          res.body.flow.should.have.property('competences');
          res.body.flow.should.have.property('language');
          res.body.flow.should.have.property('edit');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put release edit route 
  */
  describe('/PUT/releaseStudy/:flowId flow', () => {
    it('It should PUT edit list of a flow to release edition from a user', (done) => {
      let body = {
        user: userId
      }
      chai.request(app)
      .put('/api/flow/releaseFlow/'+flowId)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Edit list successfully released');
          res.body.should.have.property('flow').should.be.a('object');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put edit collaborators route 
  */
  describe('/PUT/editCollaborator/:flowId flow', () => {
    it('It should PUT collaborator list of a flow', (done) => {
      let body = {
        collaborators: [{user:'62abb01d205a125e0f72c246', invitation:'Pendiente'}]
      }
      chai.request(app)
      .put('/api/flow/editCollaborators/'+flowId)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Collaborators list successfully updated');
          res.body.should.have.property('flow');
          res.body.flow.should.be.a('object');
          res.body.flow.should.have.property('collaborators');
          res.body.flow.collaborators.length.should.be.eql(1);
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for delete by id route 
  */
  describe('/DELETE/:flowId flow', () => {
    it('It should DELETE a flow given the id', (done) => {
      chai.request(app)
      .delete('/api/flow/' + flowId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flow successfully deleted');
        done();
      });
    });
  });
  

})