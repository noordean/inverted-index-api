'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _endpointsValidation = require('./endpoints-validation');

var _endpointsValidation2 = _interopRequireDefault(_endpointsValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// specify the uploading directory
var upload = (0, _multer2.default)({ dest: 'fixtures/' }).array('fileContent');
// This is used for search endpoint since no uploading is involved
var search = (0, _multer2.default)();
var router = _express2.default.Router();

// create endpoint
router.post('/api/create', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      throw new Error(err);
    }
    res.json(_endpointsValidation2.default.create(req.body.fileName, req.files));
  });
});

// search endpoint
router.post('/api/search', search.single(), function (req, res) {
  res.json(_endpointsValidation2.default.search(_invertedIndex2.default.bookIndex, req.body.fileName, req.body.searchTerms));
});

exports.default = router;