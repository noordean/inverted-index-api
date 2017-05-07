'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_invertedIndex2.default.createIndex('book1.json', _invertedIndex2.default.readFile('book1.json'));
var superObj = {
  create: function create(app) {
    (0, _supertest2.default)(app).post('/api/create').expect('Content-Type', /json/).expect(200).field('fileName', 'malformedBook.json').attach('fileContent', _path2.default.join('fixtures', 'malformedBook.json')).expect({ error: 'Index could not be created, uploaded file must be a valid JSON file and file name must have .json extension' }).end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  },

  search: function search(app) {
    (0, _supertest2.default)(app).post('/api/search').expect('Content-Type', /json/).expect(200).send({ fileName: 'book1.json', searchTerms: 'the' }).expect({ the: [0, 1] }).end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  }
};

exports.default = superObj; // export the supertest