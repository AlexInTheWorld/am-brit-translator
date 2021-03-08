const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests: POST request to /api/translate', () => {
  
  test('Translation with text and locale fields', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ text: 'parking lot', locale: 'american-to-british' })
      .end((err, res) => {
        assert.property(res.body, 'translation', 'response includes "translation" containing translated text');
        done();
      });
    });
  
  test('Translation with text and locale fields', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ text: 'parking lot', locale: 'am-to-brit' })
      .end((err, res) => {
        assert.ownInclude(res.body, { error: 'Invalid value for locale field' }, 'response is an error message obj');
        done();
      });
  });
  
  test('Translation with text and invalid locale field', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ text: 'parking lot', locale: 'am-to-brit' })
      .end((err, res) => {
        assert.ownInclude(res.body, { error: 'Invalid value for locale field' }, 'response is an error message obj');
        done();
      });
  });
  
  test('Translation with missing locale field', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ text: 'parking lot' })
      .end((err, res) => {
        assert.ownInclude(res.body, { error: 'Required field(s) missing' }, 'response is an error message obj');
        done();
      });
  });
  
  test('Translation with missing locale field', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ text: '', locale: 'american-to-british' })
      .end((err, res) => {
        assert.ownInclude(res.body, { error: 'No text to translate' }, 'response is an error message obj');
        done();
      });
  });
  
  test('Translation with missing locale field', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({ text: 'Hi there!', locale: 'american-to-british' })
      .end((err, res) => {
        assert.propertyVal(res.body, 'translation', 'Everything looks good to me!');
        done();
      });
  });
  
});
