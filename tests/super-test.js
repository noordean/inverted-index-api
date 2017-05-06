import supertest from 'supertest';
import indexObj from '../src/inverted-index';

const superObj = {
  create: (app) => {
         supertest(app)
        .post('/api/create')
        .expect('Content-Type', /json/)
        .expect(200)
       // .send({ fileName: 'book1.json', fileContent: indexObj.readFile('book1.json')})
        //.expect({ error: 'Index could not be created, invalid JSON file selected'})
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
        //.send({ searchTerm: 'the' })
       // .expect({ error: 'Index has not been created. Kindly create index before searching' })
        .end((err, res) => {
          if (err) {
            throw err;
          }
        });
  }
};


export default superObj;  // export the supertest
