import supertest from 'supertest';
import path from 'path';
import indexObj from '../src/inverted-index';

indexObj.createIndex('book1.json', indexObj.readFile('book1.json'));
const superObj = {
  create: (app) => {
         supertest(app)
        .post('/api/create')
        .expect('Content-Type', /json/)
        .expect(200)
        .field('fileName', 'malformedBook.json')
        .attach('fileContent', path.join('fixtures', 'malformedBook.json'))
        .expect({ error: 'Index could not be created, uploaded file must be a valid JSON file and file name must have .json extension' })
        .end((err, res) => {
          if (err) {
            throw err;
          }
        });
  },

  search: (app) => {
         supertest(app)
        .post('/api/search')
        .expect('Content-Type', /json/)
        .expect(200)
        .send({ fileName: 'book1.json', searchTerms: 'the' })
        .expect({ the: [0, 1] })
        .end((err, res) => {
          if (err) {
            throw err;
          }
        });
  }
};


export default superObj;  // export the supertest
