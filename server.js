

// const express = require('express');

import express from 'express';

const bodyParser = require('body-parser');

const index = require(__dirname+'/src/inverted-index.js');

const supertest = require('supertest');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
	console.log('server now running at ' + process.env.PORT);
});

app.post('/api/create', (req, res) => {
  res.json(index.createIndex(req.body.fileName));
});

app.post('/api/search', (req, res) => {
  res.json(index.searchIndex(req.body.searchTerm));
});

supertest(app)
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
        });
