process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;
let userId;
let token2;
let userId2;

/*Flow data for test*/
let flowId;
let flowTest;
let cloneFlowId;

/*
@vjlh:
Test suite for Flow API New Implementations.
*/
describe('Flow API New Implementations', () => {
  /*
  @vjlh:
  Tries to authenticate the default user to get a JWT before apply each test.
  */    
  before((done) => {
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
      });

      chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@email.com',
        password: 'user123'
      })
      .end((err, res) => {
        token2 = res.body.token;
        userId2 = res.body.user._id;
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
        flowTest = res.body.flow;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get by user route 
  */
  describe('/GET/byUser/:userId flows', () => {
    it('It should GET all flows of a user', (done) => {
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
  describe('/GET/byUserbyPrivacy/:userId/:privacy flows', () => {
    it('It should GET all flows of a user filtered by privacy (public / private)', (done) => {
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
  describe('/GET/byUserbyType/:userId/:type flows', () => {
    it('It should GET all flows of a user filtered by type (cloned / own)', (done) => {
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
  describe('/GET/byUserCollaboration/:userId/ flows', () => {
    it('It should GET all flows of a user in which is collaborator', (done) => {
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
  Successful test for get cloning route 
  */
  describe('/GET/copy/:id/user/:userId flow', () => {
    it('It should GET a cloned flow', (done) => {
      chai.request(app)
      .get('/api/flow/clone/'+flowId+'/user/'+userId2+'/')
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flow successfully clone');
        res.body.should.have.property('flow');
        res.body.flow.should.have.property('name');
        res.body.flow.should.have.property('description');
        res.body.flow.should.have.property('sorted');
        res.body.flow.should.have.property('user').eql(userId2);
        res.body.flow.should.have.property('collaborators');
        res.body.flow.should.have.property('privacy');
        res.body.flow.should.have.property('type').eql('clone');
        res.body.flow.should.have.property('tags');
        res.body.flow.should.have.property('levels');
        res.body.flow.should.have.property('competences');
        res.body.flow.should.have.property('language');
        res.body.flow.should.have.property('edit');
        cloneFlowId = res.body.flow._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put request for edit route 
  */
  describe('/PUT/requestEdit/:id flow', () => {
    it('It should PUT the edit list of a flow to add the user id', (done) => {
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
  describe('/PUT/:id flow', () => {
    it('It should PUT a flow', (done) => {
      let flowPutTestBody = {
        name: 'Flow Updated Creation Test',
        description: 'Flow Updated Description Test',
        privacy: true,
        tags: JSON.stringify(flowTest.tags.push("updated")),

        sorted: flowTest.sorted,
        user: flowTest.user._id,
        collaborators: JSON.stringify(flowTest.collaborators),
        levels: JSON.stringify(flowTest.levels),
        language: flowTest.language._id,
        competences: JSON.stringify(flowTest.competences),
        userEdit: userId         
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
  describe('/PUT/releaseFlow/:id flow', () => {
    it('It should PUT the edit list of a flow to remove the user id', (done) => {
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
  describe('/PUT/editCollaborator/:id flow', () => {
    it('It should PUT list of collaborators of a flow and update it', (done) => {
      let body = {
        collaborators: [{user:userId2, invitation:'Pendiente'}]
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
  describe('/DELETE/:id flow', () => {
    it('It should DELETE a flow given the id', (done) => {
      chai.request(app)
      .delete('/api/flow/' + flowId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flow successfully deleted');
      });
      chai.request(app)
      .delete('/api/flow/' + cloneFlowId)
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flow successfully deleted');
        done();
      });
    });
  });
  

})