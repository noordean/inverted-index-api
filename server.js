
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
//import supertest from 'supertest';
import indexObj from './src/inverted-index';

require('dotenv').config();

const upload = multer({ dest: 'fixtures/' }).single('fileContent');
const search = multer();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
	console.log('server now running at ' + process.env.PORT);
});

app.post('/api/create', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.json({ error: 'Uploading unsuccessful!' });
    }
   if (req.file === undefined) {
      res.json({ error: 'Kindly upload a file' });
    }
    else {
      if (req.file.originalname.match('.json$') === null) {
        res.json({ error: 'Invalid file uploaded!' });
      }
      else {
        res.json(indexObj.createIndex(req.body.fileName, indexObj.readFile(req.file.filename)));
      }
      fs.unlinkSync(path.join('fixtures', req.file.filename)); // delete the uploaded file once the index is created
    }
  });
});

app.post('/api/search', search.single(), (req, res) => {
  if (req.body.fileName !== undefined) {
    res.json(indexObj.searchIndex(indexObj.index, req.body.fileName, req.body.searchTerms));
  }
  else {
    res.json(indexObj.searchIndex(indexObj.index, req.body.searchTerms));
  }
});

/*supertest(app)
        .post('/api/create')
        .expect('Content-Type', /json/)
        .expect(200)
        .send({ fileName: 'invalidBook.json'})
        .expect({ error: 'Index could not be created, invalid JSON file selected'})
        .end((err, res) => {
          if (err) {
            throw err;
          }
        });

supertest(app)
        .post('/api/search')
        .expect('Content-Type', /json/)
        .expect(200)
        .send({ searchTerm: 'the' })
        .expect({ error: 'Index has not been created. Kindly create index before searching' })
        .end((err, res) => {
          if (err) {
            throw err;
          }
        });*/
