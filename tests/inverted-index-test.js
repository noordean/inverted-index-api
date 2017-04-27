
const index = require('../src/inverted-index.js');


index.createIndex('book');

describe('Read book data', () => {
  it('should return true for valid JSON array', () => {
    expect(Array.isArray(index.fileContent)).toBe(true);
    expect(index.fileContent[0] instanceof Object).toBe(true);
    expect(index.fileContent[index.fileContent.length - 1] instanceof Object).toBe(true);
  });

  it('should not return zero for file content length', () => {
    expect(index.fileContent.length).not.toBe(0);
  });
});

describe('Populate index', () => {
  it('should return [0, 1] for "the" in the "book" document', () => {
    expect(index.index.book.the).toEqual([0, 1]);
  });

  it('should return [0] for "inquiry" in the "book" document', () => {
    expect(index.index.book.inquiry).toEqual([0]);
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

  it('should return toEqual({ "to": [0, 1], "is": [1], "into": [0] }) for "to","is","beginner"', () => {
    expect(index.searchIndex('to', 'is', 'into')).toEqual({ 'to': [0, 1], 'is': [1], 'into': [0] });
  });

  it('should return [-1] for any word not present', () => {
    expect(index.searchIndex('catwalk')).toEqual({ 'catwalk': [-1] });
  });
});
