
import express from 'express';
import bodyParser from 'body-parser';
import superObj from './tests/super-test';
import router from './route/route';

require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
	console.log('server now running at ' + process.env.PORT);
});

// load the routes
app.use('/', router);

superObj.create(app);   // load supertest for create endpoint
superObj.search(app);   // load supertest for search endpoint
