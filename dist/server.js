'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bodyParser = require('body-parser');

// const express = require('express');

var index = require(__dirname + '/src/inverted-index.js');

var supertest = require('supertest');

require('dotenv').config();

var app = (0, _express2.default)();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT, function () {
  console.log('server now running at ' + process.env.PORT);
});

app.post('/api/create', function (req, res) {
  res.json(index.createIndex(req.body.fileName));
});

app.post('/api/search', function (req, res) {
  res.json(index.searchIndex(req.body.searchTerm));
});

supertest(app).post('/api/create').expect('Content-Type', /json/).expect(200).send({ fileName: 'invalidBook.json' }).expect({ error: 'Index could not be created, invalid JSON file selected' }).end(function (err, res) {
  if (err) {
    throw err;
  }
});

supertest(app).post('/api/search').expect('Content-Type', /json/).expect(200).send({ searchTerm: 'the' }).expect({ error: 'Index has not been created. Kindly create index before searching' }).end(function (err, res) {
  if (err) {
    throw err;
  }
});