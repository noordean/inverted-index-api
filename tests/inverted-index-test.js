
const index = require('../src/inverted-index.js');


index.createIndex('book1.json');
index.createIndex('book2.json');

describe('Read book data', () => {
  it('should return true for valid JSON array', () => {
    expect(Array.isArray(index.readFile('book1.json'))).toBe(true);
    expect(index.readFile('book2.json')[0] instanceof Object).toBe(true);
    expect(index.readFile('book1.json')[index.readFile('book1.json').length - 1] instanceof Object).toBe(true);
  });

  it('should not return zero for file content length', () => {
    expect(index.readFile('book1.json')).not.toBe(0);
  });

  it('should return an error message for invalid file', () => {
    expect(index.readFile('invalidBook.json')).toBe('Invalid JSON file');
  });
});

describe('Populate index', () => {
  it('should return [0, 1] for "the" in the "book2.json" document', () => {
    expect(index.index['book2.json'].the).toEqual([0, 1]);
  });

  it('should return [1] for "us" in the "book1.json" document', () => {
    expect(index.index['book1.json'].us).toEqual([1]);
  });
});

describe('Search index', () => {
  it('should return { "third": [1] } for the word "third"', () => {
    expect(index.searchIndex('third')).toEqual({ 'third': [1] });
  });

  it('should return { "set": [0, 1] } for the word "Set"', () => {
    expect(index.searchIndex('Set')).toEqual({ 'set': [0, 1] });
  });

  it('should return { "understand":[0,1], "from": [1] } for array ["understand","from"]', () => {
    expect(index.searchIndex(['understand', 'from'])).toEqual({ 'understand':[0,1], 'from': [1] });
  });

  it('should return { "to": [0, 1], "is": [1], "into": [0] } for "to","is","beginner"', () => {
    expect(index.searchIndex('to', 'is', 'into')).toEqual({ 'to': [0, 1], 'is': [1], 'into': [0] });
  });

  it('should return [-1] for any word not present', () => {
    expect(index.searchIndex('catwalk')).toEqual({ 'catwalk': [-1] });
  });
});
