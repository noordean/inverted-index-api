'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _superTest = require('./tests/super-test');

var _superTest2 = _interopRequireDefault(_superTest);

var _route = require('./route/route');

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.listen(process.env.PORT, function () {
	console.log('server now running at ' + process.env.PORT);
});

// load the routes
app.use('/', _route2.default);

_superTest2.default.create(app); // load supertest for create endpoint
_superTest2.default.search(app); // load supertest for search endpoint