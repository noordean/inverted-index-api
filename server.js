import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import router from './route/route';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
	console.log('server now running at ' + process.env.PORT);
});

// load the routes
app.use('/', router);

export default app;
