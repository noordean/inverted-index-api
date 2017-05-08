'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_invertedIndex2.default.createIndex('book1.json', _invertedIndex2.default.readFile('book1.json'));
_invertedIndex2.default.createIndex('book2.json', _invertedIndex2.default.readFile('book2.json'));

var createdIndexForBook1 = {
  'book1.json': {
    accept: [1],
    as: [1],
    best: [0],
    brown: [0],
    campbell: [1],
    doing: [0],
    for: [0, 1],
    go: [1],
    have: [1],
    is: [0, 1],
    jackson: [0],
    joseph: [1],
    let: [1],
    life: [1],
    must: [1],
    of: [1],
    one: [1],
    preparation: [0],
    so: [1],
    that: [1],
    the: [0, 1],
    to: [1],
    today: [0],
    tomorrow: [0],
    us: [1],
    waiting: [1],
    we: [1],
    your: [0]
  },
  'book2.json': {
    also: [1],
    an: [0],
    first: [1],
    from: [1],
    help: [0, 1],
    inquiry: [0],
    into: [0],
    is: [1],
    nations: [0],
    of: [0],
    problem: [0, 1],
    seeks: [0],
    set: [0, 1],
    string: [0, 1],
    the: [0, 1],
    third: [1],
    this: [0, 1],
    to: [0, 1],
    understand: [0, 1],
    wealth: [0],
    world: [1],
    you: [0, 1]
  }
};

describe('Read book data', function () {
  it('should return true for valid JSON array', function () {
    expect(Array.isArray(_invertedIndex2.default.readFile('book1.json'))).toBe(true);
    expect(_invertedIndex2.default.readFile('book2.json')[0] instanceof Object).toBe(true);
    expect(_invertedIndex2.default.readFile('book1.json')[_invertedIndex2.default.readFile('book1.json').length - 1] instanceof Object).toBe(true);
  });

  it('should not return zero for file content length', function () {
    expect(_invertedIndex2.default.readFile('book1.json').length).not.toBe(0);
  });

  it('should return an error message for malformed file', function () {
    expect(_invertedIndex2.default.readFile('malformedBook.json')).toBe('Malformed JSON file');
  });
});

describe('Populate index', function () {
  it('should return [0, 1] for "the" in the "book2.json" document', function () {
    expect(_invertedIndex2.default.index['book2.json'].the).toEqual([0, 1]);
  });

  it('should return [1] for "us" in the "book1.json" document', function () {
    expect(_invertedIndex2.default.index['book1.json'].us).toEqual([1]);
  });
});

describe('Search index', function () {
  it('should return { "third": [1] } for the word "third"', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, 'third')).toEqual({ 'book2.json': { 'third': [1] }, 'book1.json': { 'third': [-1] } });
  });

  it('should return { "set": [0, 1] } for the word "Set" in book2.json', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, 'book2.json', 'Set')).toEqual({ 'set': [0, 1] });
  });

  it('should return { "understand":[0,1], "from": [1] } for array ["understand","from"]', function () {
    var result = { 'book2.json': { from: [1], understand: [0, 1] }, 'book1.json': { from: [-1], understand: [-1] } };
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, ['understand', 'from'])).toEqual(result);
  });

  it('should return { "to": [0, 1], "is": [1], "into": [0] } for "to","is","into"', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, 'book2.json', 'to', 'is', 'into')).toEqual({ 'to': [0, 1], 'is': [1], 'into': [0] });
  });

  it('should return [-1] for any word not present', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, 'book1.json', 'catwalk')).toEqual({ catwalk: [-1] });
  });
});

describe('create index endpoint', function () {
  it('should return an error message for malformed file', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'malformedBook.json').attach('fileContent', _path2.default.join('fixtures', 'malformedBook.json')).expect({ error: 'Index could not be created, uploaded file must be a valid JSON file and file name must have .json extension' }).end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  });

  it('should create correct index for any file uploaded', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'book1.json').attach('fileContent', _path2.default.join('fixtures', 'book1.json')).expect(createdIndexForBook1).end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  });

  it('should return "kindly upload a file" when no file is uploaded', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'book1.json').expect({ error: 'Kindly upload a file' }).end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  });

  it('should return "Invalid file uploaded" when no file is uploaded', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'invalidBook.txt').attach('fileContent', _path2.default.join('fixtures', 'invalidBook.txt')).expect({ error: 'Invalid file uploaded!' }).end(function (err, res) {
      if (err) {
        throw err;
      }
    });
  });
});

describe('search index endpoint', function () {
  it('should return "Index has not been created for the specified file" if index has not been created', function (done) {
    (0, _supertest2.default)(_server2.default).post('/api/search').send({ fileName: 'book3.json', searchTerms: 'the' }).expect({ error: 'Index has not been created for the specified file' }).end(function (err, res) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  it('should return correct result if both fileName and searchTerms are supplied', function (done) {
    (0, _supertest2.default)(_server2.default).post('/api/search').send({ fileName: 'book1.json', searchTerms: 'best' }).expect({ best: [0] }).end(function (err, res) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  it('should return correct result if fileName is not supplied', function (done) {
    (0, _supertest2.default)(_server2.default).post('/api/search').send({ searchTerms: 'today' }).expect({ 'book1.json': { today: [0] }, 'book2.json': { today: [-1] } }).end(function (err, res) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });
});