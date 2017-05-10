'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @description: It does validation inside the routes
 * @class
 */
var Validation = function () {
  function Validation() {
    _classCallCheck(this, Validation);
  }

  _createClass(Validation, [{
    key: 'create',


    /**
     * @description: validates the api/create endpoint
     * @param {string} fileName
     * @param {Object} file
     * @return {Object} result
     */
    value: function create(fileName, file) {
      this.file = '';
      var result = '';
      if (file !== undefined) {
        if (file.originalname.match('.json$') === null) {
          result = { error: 'Invalid file uploaded!' };
          _fs2.default.unlinkSync(_path2.default.join('fixtures', file.filename)); // delete the uploaded file once the index is created
        }
        if (file.originalname.match('.json$') !== null) {
          result = _invertedIndex2.default.createIndex(fileName, _invertedIndex2.default.readFile(file.filename));
          _fs2.default.unlinkSync(_path2.default.join('fixtures', file.filename)); // delete the uploaded file once the index is created
        }
      } else {
        result = { error: 'Kindly upload a file' };
      }
      return result;
    }

    /**
     * @description: validates /api/search endpoint
     * @param {Object} index
     * @param {String} fileName
     * @param {Object} searchTerms
     * @return {Object} fileContent
     */

  }, {
    key: 'search',
    value: function search(index, fileName, searchTerms) {
      this.file = '';
      if (fileName !== undefined) {
        if (searchTerms.length === 0) {
          return { error: 'The searchTerms cannot be empty' };
        }
        return _invertedIndex2.default.searchIndex(index, fileName, searchTerms);
      } else {
        if (searchTerms.length === 0) {
          return { error: 'The searchTerms cannot be empty' };
        }
        return _invertedIndex2.default.searchIndex(index, searchTerms);
      }
    }
  }]);

  return Validation;
}();

exports.default = new Validation();