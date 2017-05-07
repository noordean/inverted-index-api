
import indexObj from '../src/inverted-index';


indexObj.createIndex('book1.json', indexObj.readFile('book1.json'));
indexObj.createIndex('book2.json', indexObj.readFile('book2.json'));
indexObj.createIndex('book2.json', indexObj.readFile('invalidBook.json'));

describe('Read book data', () => {
  it('should return true for valid JSON array', () => {
    expect(Array.isArray(indexObj.readFile('book1.json'))).toBe(true);
    expect(indexObj.readFile('book2.json')[0] instanceof Object).toBe(true);
    expect(indexObj.readFile('book1.json')[indexObj.readFile('book1.json').length - 1] instanceof Object).toBe(true);
  });

  it('should not return zero for file content length', () => {
    expect(indexObj.readFile('book1.json').length).not.toBe(0);
  });

  it('should return an error message for malformed file', () => {
    expect(indexObj.readFile('malformedBook.json')).toBe('Malformed JSON file');
  });
});

describe('Populate index', () => {
  it('should return [0, 1] for "the" in the "book2.json" document', () => {
    expect(indexObj.index['book2.json'].the).toEqual([0, 1]);
  });

  it('should return [1] for "us" in the "book1.json" document', () => {
    expect(indexObj.index['book1.json'].us).toEqual([1]);
  });
});

describe('Search index', () => {
  it('should return { "third": [1] } for the word "third"', () => {
    expect(indexObj.searchIndex(indexObj.index, 'third')).toEqual({ 'book2.json': { 'third': [1] }, 'book1.json': { 'third': [-1] } });
  });

  it('should return { "set": [0, 1] } for the word "Set" in book2.json', () => {
    expect(indexObj.searchIndex(indexObj.index, 'book2.json', 'Set')).toEqual({ 'set': [0, 1] });
  });

  it('should return { "understand":[0,1], "from": [1] } for array ["understand","from"]', () => {
    const result = { 'book2.json': { 'from': [1], 'understand': [0, 1] }, 'book1.json': { 'from': [-1], 'understand': [-1] } };
    expect(indexObj.searchIndex(indexObj.index, ['understand', 'from'])).toEqual(result);
  });

  it('should return { "to": [0, 1], "is": [1], "into": [0] } for "to","is","into"', () => {
    expect(indexObj.searchIndex(indexObj.index, 'book2.json', 'to', 'is', 'into')).toEqual({ 'to': [0, 1], 'is': [1], 'into': [0] });
  });

  it('should return [-1] for any word not present', () => {
    expect(indexObj.searchIndex(indexObj.index, 'book1.json', 'catwalk')).toEqual({ 'catwalk': [-1] });
  });
});
