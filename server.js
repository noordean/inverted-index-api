require('dotenv').config();
const express = require('express');

const app = express();

app.listen(process.env.PORT,function(){
	console.log("server now running at "+process.env.PORT)
});