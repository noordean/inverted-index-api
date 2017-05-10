import supertest from 'supertest';
import path from 'path';
import invertedIndexObject from '../src/inverted-index';
import app from '../server';


invertedIndexObject.createIndex('book1.json', invertedIndexObject.readFile('book1.json'));
invertedIndexObject.createIndex('book2.json', invertedIndexObject.readFile('book2.json'));

const createdIndexForBook = {
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

describe('Read book data', () => {
  it('should return true for valid JSON array', () => {
    expect(Array.isArray(invertedIndexObject.readFile('book1.json'))).toBe(true);
    expect(invertedIndexObject.readFile('book2.json')[0] instanceof Object).toBe(true);
    expect(invertedIndexObject.readFile('book1.json')[invertedIndexObject.readFile('book1.json').length - 1] instanceof Object).toBe(true);
  });

  it('should ensure valid JSON array is not empty', () => {
    expect(invertedIndexObject.readFile('book1.json').length).not.toBe(0);
  });

  it('should return an error message for a malformed file', () => {
    expect(invertedIndexObject.readFile('malformedBook.json')).toBe('Malformed JSON file');
  });

  it('should return an error message for an empty file', () => {
    expect(invertedIndexObject.readFile('emptyBook.json')).toBe('Empty JSON file');
  });

  it('should return an error message for an invalid file', () => {
    expect(invertedIndexObject.readFile('invalidJsonFile.json')).toBe('Invalid JSON file');
  });
});

describe('Populate index', () => {
  it('should ensure created index is correct', () => {
    expect(invertedIndexObject.index['book2.json'].the).toEqual([0, 1]);
  });

  it('should return [1] for "us" in the "book1.json" document', () => {
    expect(invertedIndexObject.index['book1.json'].us).toEqual([1]);
  });
});

describe('Search index', () => {
  it('should return { "third": [1] } for the word "third"', () => {
    expect(invertedIndexObject.searchIndex(invertedIndexObject.index, 'third')).toEqual({ 'book2.json': { third: [1] }, 'book1.json': { third: [-1] } });
  });

  it('should return { "set": [0, 1] } for the word "Set" in book2.json', () => {
    expect(invertedIndexObject.searchIndex(invertedIndexObject.index, 'book2.json', 'Set')).toEqual({ set: [0, 1] });
  });

  it('should ensure searchIndex goes through all indexed files if a fileName is not provided', () => {
    const result = { 'book2.json': { from: [1], understand: [0, 1] }, 'book1.json': { from: [-1], understand: [-1] } };
    expect(invertedIndexObject.searchIndex(invertedIndexObject.index, ['understand', 'from'])).toEqual(result);
  });

  it('should ensure searchIndex handles varied number of search terms', () => {
    expect(invertedIndexObject.searchIndex(invertedIndexObject.index, 'book2.json', 'to', 'is', ['into', 'problem'])).toEqual({ to: [0, 1], is: [1], into: [0], problem: [0, 1] });
  });

  it('should ensure index returns correct result when searched', () => {
    expect(invertedIndexObject.searchIndex(invertedIndexObject.index, 'book1.json', 'catwalk')).toEqual({ catwalk: [-1] });
  });

  it('should ensure a valid index is passed in', () => {
    expect(invertedIndexObject.searchIndex('My index', 'book1.json', 'catwalk')).toEqual({ error: 'A valid index has not been created. Kindly create index before searching' });
  });

  it('should ensure searchIndex handles an array of search terms', () => {
    expect(invertedIndexObject.searchIndex(invertedIndexObject.index, 'book1.json', ['accept', 'the'])).toEqual({ accept: [1], the: [0, 1] });
  });

  it('should return proper error message if index has not been created for the provided filename', () => {
    expect(invertedIndexObject.searchIndex(invertedIndexObject.index, 'book4.json', 'third')).toEqual({ error: 'Index has not been created for the specified file' });
  });
});

describe('Validity of JSON array', () => {
  it('should return true for a valid JSON array', () => {
    expect(invertedIndexObject.isValidJSON(invertedIndexObject.readFile('book2.json'))).toBe(true);
  });

  it('should return false for an invalid JSON array', () => {
    expect(invertedIndexObject.isValidJSON(invertedIndexObject.readFile('invalidJsonBook.json'))).toBe(false);
  });
});

describe('Validity of file name', () => {
  it('should return true for a valid file', () => {
    expect(invertedIndexObject.isValidFileName('book2.json')).toBe(true);
  });

  it('should return false for an invalid file', () => {
    expect(invertedIndexObject.isValidFileName('invalidBook.txt')).toBe(false);
  });
});

describe('Validity of the index created', () => {
  it('should return true for a valid index', () => {
    expect(invertedIndexObject.isIndexValid(invertedIndexObject.createIndex('book1.json', invertedIndexObject.readFile('book1.json')))).toBe(true);
  });

  it('should return false for an invalid index', () => {
    expect(invertedIndexObject.isIndexValid(invertedIndexObject.createIndex('invalidJsonBook.json', invertedIndexObject.readFile('invalidJsonBook.json')))).toBe(false);
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
    .expect(createdIndexForBook)
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

  it('should return "Invalid file uploaded" when no file is uploaded', () => {
    supertest(app)
    .post('/api/create')
    .field('fileName', 'invalidBook.txt')
    .attach('fileContent', path.join('fixtures', 'invalidBook.txt'))
    .expect({ error: 'Invalid file uploaded!' })
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
    .expect({ error: 'Index has not been created for the specified file' })
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
    .expect({ 'book1.json': { today: [0] }, 'book2.json': { today: [-1] } })
        .end((err) => {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
  });
});
