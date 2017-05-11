import supertest from 'supertest';
import path from 'path';
import invertedIndex from '../src/inverted-index';
import app from '../server';
import expectedResults from './expected-results';

const expectedBookIndex = expectedResults.createdBookIndex;

describe('Read book data', () => {
  it('should return true for valid JSON array', () => {
    expect(Array.isArray(invertedIndex.validateFile('book1.json'))).toBe(true);
    expect(invertedIndex.isValidJSON(invertedIndex.validateFile('book2.json'))).toBe(true);
    expect(invertedIndex.isValidJSON(invertedIndex.validateFile('book1.json'))).toBe(true);
  });

  it('should ensure valid JSON array is not empty', () => {
    expect(invertedIndex.validateFile('book1.json').length).not.toBe(0);
  });

  it('should return an error message for a malformed file', () => {
    expect(invertedIndex.validateFile('malformedBook.json')).toBe('Malformed JSON file');
  });

  it('should return an error message for an empty file', () => {
    expect(invertedIndex.validateFile('emptyBook.json')).toBe('Empty JSON file');
  });

  it('should return an error message for an invalid file', () => {
    expect(invertedIndex.validateFile('invalidJsonFile.json')).toBe('Invalid JSON file');
  });
});

describe('Populate index', () => {
  it('should ensure created index is correct', () => {
    expect(invertedIndex.bookIndex['book2.json'].the).toEqual([0, 1]);
  });

  it('should return [1] for "us" in the "book1.json" document', () => {
    expect(invertedIndex.bookIndex['book1.json'].us).toEqual([1]);
  });
});

describe('Search index', () => {
  it('should return { "third": [1] } for the word "third" when the file name is not provided', () => {
    expect(invertedIndex.searchIndex(invertedIndex.bookIndex, 'third')).toEqual({ 'book2.json': { third: [1] }, 'book1.json': { third: [] } });
  });

  it('should return { "set": [0, 1] } for the word "Set" in book2.json', () => {
    expect(invertedIndex.searchIndex(invertedIndex.bookIndex, 'book2.json', 'Set')).toEqual({ set: [0, 1] });
  });

  it('should ensure searchIndex goes through all indexed files if a fileName is not provided and when an array is supplied as search terms', () => {
    const result = { 'book2.json': { from: [1], understand: [0, 1] }, 'book1.json': { from: [], understand: [] } };
    expect(invertedIndex.searchIndex(invertedIndex.bookIndex, ['understand', 'from'])).toEqual(result);
  });

  it('should ensure searchIndex handles varied number of search terms', () => {
    expect(invertedIndex.searchIndex(invertedIndex.bookIndex, 'book2.json', 'to', 'is', ['into', 'problem'])).toEqual({ to: [0, 1], is: [1], into: [0], problem: [0, 1] });
  });

  it('should ensure index returns correct result when searched', () => {
    expect(invertedIndex.searchIndex(invertedIndex.bookIndex, 'book1.json', 'catwalk')).toEqual({ catwalk: [-1] });
  });

  it('should ensure a valid index is passed in', () => {
    expect(invertedIndex.searchIndex('My index', 'book1.json', 'catwalk')).toEqual({ error: 'A valid index has not been created. Kindly create index before searching' });
  });

  it('should ensure searchIndex handles an array of search terms', () => {
    expect(invertedIndex.searchIndex(invertedIndex.bookIndex, 'book1.json', ['accept', 'the'])).toEqual({ accept: [1], the: [0, 1] });
  });

  it('should return proper error message if index has not been created for the provided filename', () => {
    expect(invertedIndex.searchIndex(invertedIndex.bookIndex, 'book4.json', 'third')).toEqual({ error: 'Index has not been created for the specified file, kindly create an index for it' });
  });
});

describe('Validation of JSON array', () => {
  it('should return true for a valid JSON array', () => {
    expect(invertedIndex.isValidJSON(invertedIndex.validateFile('book2.json'))).toBe(true);
  });

  it('should return false for an invalid JSON array', () => {
    expect(invertedIndex.isValidJSON(invertedIndex.validateFile('invalidJsonBook.json'))).toBe(false);
  });
});

describe('Validation of file name', () => {
  it('should return true for a valid file', () => {
    expect(invertedIndex.isValidFileName('book2.json')).toBe(true);
  });

  it('should return false for an invalid file', () => {
    expect(invertedIndex.isValidFileName('invalidBook.txt')).toBe(false);
  });
});

describe('Validation of the index created', () => {
  it('should return true for a valid index', () => {
    expect(invertedIndex.isIndexValid(invertedIndex.createIndex('book1.json', invertedIndex.validateFile('book1.json')))).toBe(true);
  });

  it('should return false for an invalid index', () => {
    expect(invertedIndex.isIndexValid(invertedIndex.createIndex('invalidJsonBook.json', invertedIndex.validateFile('invalidJsonBook.json')))).toBe(false);
  });
});

describe('create index endpoint', () => {
  it('should return an error message for malformed file', () => {
    supertest(app)
    .post('/api/create')
    .field('fileName', 'malformedBook.json')
    .attach('fileContent', path.join('fixtures', 'malformedBook.json'))
    .expect({ error: 'Index could not be created, uploaded file must be a valid JSON file and file name must have .json extension' })
        .end((err) => {
          if (err) {
            throw err;
          }
        });
  });

  it('should create correct index for any file uploaded', () => {
    supertest(app)
    .post('/api/create')
    .field('fileName', 'book1.json')
    .attach('fileContent', path.join('fixtures', 'book1.json'))
    .expect(expectedBookIndex)
        .end((err) => {
          if (err) {
            throw err;
          }
        });
  });

  it('should return "kindly upload a file" when no file is uploaded', () => {
    supertest(app)
    .post('/api/create')
    .field('fileName', 'book1.json')
    .expect({ error: 'Kindly upload a file' })
        .end((err) => {
          if (err) {
            throw err;
          }
        });
  });

  it('should return "Invalid file uploaded" when invalid file is uploaded', () => {
    supertest(app)
    .post('/api/create')
    .field('fileName', 'invalidBook.txt')
    .attach('fileContent', path.join('fixtures', 'invalidBook.txt'))
    .expect({ error: 'An Invalid file detected, kindly select a valid file and re-upload!' })
        .end((err) => {
          if (err) {
            throw err;
          }
        });
  });
});


describe('search index endpoint', () => {
  it('should return "Index has not been created for the specified file" if index has not been created', (done) => {
    supertest(app)
    .post('/api/search')
    .send({ fileName: 'book3.json', searchTerms: 'the' })
    .expect({ error: 'Index has not been created for the specified file, kindly create an index for it' })
        .end((err) => {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
  });

  it('should return correct result if both fileName and searchTerms are supplied', (done) => {
    supertest(app)
    .post('/api/search')
    .send({ fileName: 'book1.json', searchTerms: 'best' })
    .expect({ best: [0] })
        .end((err) => {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
  });

  it('should return correct result if fileName is not supplied', (done) => {
    supertest(app)
    .post('/api/search')
    .send({ searchTerms: 'today' })
    .expect({ 'book1.json': { today: [0] }, 'book2.json': { today: [] } })
        .end((err) => {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
  });
});
