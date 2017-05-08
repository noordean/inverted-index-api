'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upload = (0, _multer2.default)({ dest: 'fixtures/' }).single('fileContent'); // specify the uploading directory
var search = (0, _multer2.default)(); // This is used for search endpoint since no uploading is involved
var router = _express2.default.Router();

// create endpoint
router.post('/api/create', function (req, res) {
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

// search endpoint
router.post('/api/search', search.single(), function (req, res) {
  if (req.body.fileName !== undefined) {
    if (req.body.searchTerms.length === 0) {
      res.json({ error: 'The searchTerms cannot be empty' });
    }
    res.json(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, req.body.fileName, req.body.searchTerms));
  } else {
    if (req.body.searchTerms.length === 0) {
      res.json({ error: 'The searchTerms cannot be empty' });
    }
    res.json(_invertedIndex2.default.searchIndex(_invertedIndex2.default.index, req.body.searchTerms));
  }
});

exports.default = router;