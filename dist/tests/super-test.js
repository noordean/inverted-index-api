'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var superObj = {
  create: function create(app) {
    (0, _supertest2.default)(app).post('/api/create').expect('Content-Type', /json/).expect(200)
    // .send({ fileName: 'book1.json', fileContent: indexObj.readFile('book1.json')})
    //.expect({ error: 'Index could not be created, invalid JSON file selected'})
    .end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  },

  search: function search(app) {
    (0, _supertest2.default)(app).post('/api/search').expect('Content-Type', /json/).expect(200)
    //.send({ searchTerm: 'the' })
    // .expect({ error: 'Index has not been created. Kindly create index before searching' })
    .end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  }
};

exports.default = superObj; // export the supertest