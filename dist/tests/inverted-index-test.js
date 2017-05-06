'use strict';

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_invertedIndex2.default.createIndex('book1.json', _invertedIndex2.default.readFile('book1.json'));
_invertedIndex2.default.createIndex('book2.json', _invertedIndex2.default.readFile('book2.json'));
_invertedIndex2.default.createIndex('book2.json', _invertedIndex2.default.readFile('invalidBook.json'));

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
    var result = { 'book2.json': { 'from': [1], 'understand': [0, 1] }, 'book1.json': { 'from': [-1], 'understand': [-1] } };
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, ['understand', 'from'])).toEqual(result);
  });

  it('should return { "to": [0, 1], "is": [1], "into": [0] } for "to","is","into"', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, 'book2.json', 'to', 'is', 'into')).toEqual({ 'to': [0, 1], 'is': [1], 'into': [0] });
  });

  it('should return [-1] for any word not present', function () {
    expect(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, 'book1.json', 'catwalk')).toEqual({ 'catwalk': [-1] });
  });
});