'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

var _expectedResults = require('./expected-results');

var _expectedResults2 = _interopRequireDefault(_expectedResults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expectedBookIndex = _expectedResults2.default.createdBookIndex;

describe('Read book data', function () {
  it('should return true for valid JSON array', function () {
    expect(Array.isArray(_invertedIndex2.default.validateFile('book1.json'))).toBe(true);
    expect(_invertedIndex2.default.isValidJSON(_invertedIndex2.default.validateFile('book2.json'))).toBe(true);
    expect(_invertedIndex2.default.isValidJSON(_invertedIndex2.default.validateFile('book1.json'))).toBe(true);
  });

  it('should ensure valid JSON array is not empty', function () {
    expect(_invertedIndex2.default.validateFile('book1.json').length).not.toBe(0);
  });

  it('should return an error message for a malformed file', function () {
    expect(_invertedIndex2.default.validateFile('malformedBook.json')).toBe('Malformed JSON file');
  });

  it('should return an error message for an empty file', function () {
    expect(_invertedIndex2.default.validateFile('emptyBook.json')).toBe('Empty JSON file');
  });

  it('should return an error message for an invalid file', function () {
    expect(_invertedIndex2.default.validateFile('invalidJsonFile.json')).toBe('Invalid JSON file');
  });
});

describe('Populate index', function () {
  it('should ensure created index is correct', function () {
    expect(_invertedIndex2.default.bookIndex['book2.json'].the).toEqual([0, 1]);
  });

  it('should return [1] for "us" in the "book1.json" document', function () {
    expect(_invertedIndex2.default.bookIndex['book1.json'].us).toEqual([1]);
  });
});

describe('Search index', function () {
  it('should return { "third": [1] } for the word "third" when the file name is not provided', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.bookIndex, 'third')).toEqual({ 'book2.json': { third: [1] }, 'book1.json': { third: [] } });
  });

  it('should return { "set": [0, 1] } for the word "Set" in book2.json', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.bookIndex, 'book2.json', 'Set')).toEqual({ set: [0, 1] });
  });

  it('should ensure searchIndex goes through all indexed files if a fileName is not provided and when an array is supplied as search terms', function () {
    var result = { 'book2.json': { from: [1], understand: [0, 1] }, 'book1.json': { from: [], understand: [] } };
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.bookIndex, ['understand', 'from'])).toEqual(result);
  });

  it('should ensure searchIndex handles varied number of search terms', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.bookIndex, 'book2.json', 'to', 'is', ['into', 'problem'])).toEqual({ to: [0, 1], is: [1], into: [0], problem: [0, 1] });
  });

  it('should ensure index returns correct result when searched', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.bookIndex, 'book1.json', 'catwalk')).toEqual({ catwalk: [-1] });
  });

  it('should ensure a valid index is passed in', function () {
    expect(_invertedIndex2.default.searchIndex('My index', 'book1.json', 'catwalk')).toEqual({ error: 'A valid index has not been created. Kindly create index before searching' });
  });

  it('should ensure searchIndex handles an array of search terms', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.bookIndex, 'book1.json', ['accept', 'the'])).toEqual({ accept: [1], the: [0, 1] });
  });

  it('should return proper error message if index has not been created for the provided filename', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.bookIndex, 'book4.json', 'third')).toEqual({ error: 'Index has not been created for the specified file, kindly create an index for it' });
  });
});

describe('Validation of JSON array', function () {
  it('should return true for a valid JSON array', function () {
    expect(_invertedIndex2.default.isValidJSON(_invertedIndex2.default.validateFile('book2.json'))).toBe(true);
  });

  it('should return false for an invalid JSON array', function () {
    expect(_invertedIndex2.default.isValidJSON(_invertedIndex2.default.validateFile('invalidJsonBook.json'))).toBe(false);
  });
});

describe('Validation of file name', function () {
  it('should return true for a valid file', function () {
    expect(_invertedIndex2.default.isValidFileName('book2.json')).toBe(true);
  });

  it('should return false for an invalid file', function () {
    expect(_invertedIndex2.default.isValidFileName('invalidBook.txt')).toBe(false);
  });
});

describe('Validation of the index created', function () {
  it('should return true for a valid index', function () {
    expect(_invertedIndex2.default.isIndexValid(_invertedIndex2.default.createIndex('book1.json', _invertedIndex2.default.validateFile('book1.json')))).toBe(true);
  });

  it('should return false for an invalid index', function () {
    expect(_invertedIndex2.default.isIndexValid(_invertedIndex2.default.createIndex('invalidJsonBook.json', _invertedIndex2.default.validateFile('invalidJsonBook.json')))).toBe(false);
  });
});

describe('create index endpoint', function () {
  it('should return an error message for malformed file', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'malformedBook.json').attach('fileContent', _path2.default.join('fixtures', 'malformedBook.json')).expect({ error: 'Index could not be created, uploaded file must be a valid JSON file and file name must have .json extension' }).end(function (err) {
      if (err) {
        throw err;
      }
    });
  });

  it('should create correct index for any file uploaded', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'book1.json').attach('fileContent', _path2.default.join('fixtures', 'book1.json')).expect(expectedBookIndex).end(function (err) {
      if (err) {
        throw err;
      }
    });
  });

  it('should return "kindly upload a file" when no file is uploaded', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'book1.json').expect({ error: 'Kindly upload a file' }).end(function (err) {
      if (err) {
        throw err;
      }
    });
  });

  it('should return "Invalid file uploaded" when invalid file is uploaded', function () {
    (0, _supertest2.default)(_server2.default).post('/api/create').field('fileName', 'invalidBook.txt').attach('fileContent', _path2.default.join('fixtures', 'invalidBook.txt')).expect({ error: 'An Invalid file detected, kindly select a valid file and re-upload!' }).end(function (err) {
      if (err) {
        throw err;
      }
    });
  });
});

describe('search index endpoint', function () {
  it('should return "Index has not been created for the specified file" if index has not been created', function (done) {
    (0, _supertest2.default)(_server2.default).post('/api/search').send({ fileName: 'book3.json', searchTerms: 'the' }).expect({ error: 'Index has not been created for the specified file, kindly create an index for it' }).end(function (err) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  it('should return correct result if both fileName and searchTerms are supplied', function (done) {
    (0, _supertest2.default)(_server2.default).post('/api/search').send({ fileName: 'book1.json', searchTerms: 'best' }).expect({ best: [0] }).end(function (err) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  it('should return correct result if fileName is not supplied', function (done) {
    (0, _supertest2.default)(_server2.default).post('/api/search').send({ searchTerms: 'today' }).expect({ 'book1.json': { today: [0] }, 'book2.json': { today: [] } }).end(function (err) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });
});