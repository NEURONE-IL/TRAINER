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

/*
@vjlh:
Test suite for FlowSearch API.
*/
describe('FlowSearch API', () => {
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
          done();
      });
  });

  /*
  @vjlh:
  Successful test for post route search flows for query
  */
  describe('/POST/search/:userId/:query/:page searchFlows', () => {
    it('It should POST all relevant flows for a query', (done) => {
      let query = 'prueba';
      let page = '1';
      chai.request(app)
      .post('/api/flowSearch/search/'+userId+'/'+query+'/'+page)
      .set({ 'x-access-token': token })
      .send(page)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flows search successfully get');
        res.body.should.have.property('actualPage').eql(page);
        res.body.should.have.property('totalDocs');
        res.body.should.have.property('docs');
        res.body.docs.should.be.a('array');
  
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for post route search all public flows
  */
  describe('/POST/search/:userId/:query/:page searchFlows', () => {
    it('It should POST all flows available for search', (done) => {
      let query = 'all';
      let page = '1';
      chai.request(app)
      .post('/api/flowSearch/search/'+userId+'/'+query+'/'+page)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flows search successfully get');
        res.body.should.have.property('actualPage').eql(page);
        res.body.should.have.property('totalDocs');
        res.body.should.have.property('docs');
        res.body.docs.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for post route search no results
  */
  describe('/POST/search/:userId/:query/:page searchFlows', () => {
    it('It should POST no result flows for a query', (done) => {
      let query = 'NotResultTest';
      let page = '1';
      chai.request(app)
      .post('/api/flowSearch/search/'+userId+'/'+query+'/'+page)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Flows search successfully get');
        res.body.should.have.property('actualPage').eql(page);
        res.body.should.have.property('totalDocs');
        res.body.should.have.property('docs');
        res.body.docs.should.be.a('array');
        res.body.docs.length.should.be.eql(0);
        done();
      });
    });
  });



});