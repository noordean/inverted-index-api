'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _invertedIndex = require('./src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
//import supertest from 'supertest';


var upload = (0, _multer2.default)({ dest: 'fixtures/' }).single('fileContent');
var search = (0, _multer2.default)();

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.listen(process.env.PORT, function () {
  console.log('server now running at ' + process.env.PORT);
});

app.post('/api/create', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error: 'Uploading unsuccessful!' });
    }
    if (req.file === undefined) {
      res.json({ error: 'Kindly upload a file' });
    } else {
      if (req.file.originalname.match('.json$') === null) {
        res.json({ error: 'Invalid file uploaded!' });
      } else {
        res.json(_invertedIndex2.default.createIndex(req.body.fileName, _invertedIndex2.default.readFile(req.file.filename)));
      }
      _fs2.default.unlinkSync(_path2.default.join('fixtures', req.file.filename)); // delete the uploaded file once the index is created
    }
  });
});

app.post('/api/search', search.single(), function (req, res) {
  if (req.body.fileName !== undefined) {
    res.json(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, req.body.fileName, req.body.searchTerms));
  } else {
    res.json(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, req.body.searchTerms));
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