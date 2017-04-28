require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');

const index = require(__dirname+'/src/inverted-index.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
	console.log('server now running at ' + process.env.PORT);
});

app.post('/api/create', (req, res) => {
  index.createIndex(req.body.file);
  res.json({ message: 'Index created' });
});

app.post('/api/search', (req, res) => {
  res.json(index.searchIndex(req.body.token));
});
