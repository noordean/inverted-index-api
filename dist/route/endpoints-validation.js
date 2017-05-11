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
    key: 'deleteUploadedFiles',


    /**
     * @description: delete files after index has been created
     * @param {Object} files
     * @return {Object} nothing
     */
    value: function deleteUploadedFiles(files) {
      this.file = '';
      files.forEach(function (file) {
        _fs2.default.unlinkSync(_path2.default.join('fixtures', file.filename));
      });
    }

    /**
     * @description: checks for invalid filename
     * @param {Object} files
     * @return {Boolean} true/false
     */

  }, {
    key: 'containInvalidFileName',
    value: function containInvalidFileName(files) {
      this.file = files;
      var getInvalidFile = [];
      files.forEach(function (file) {
        if (file.originalname.match('.json$') === null) {
          getInvalidFile.push('error!');
        }
      });
      if (getInvalidFile.length === 0) {
        return false;
      }
      return true;
    }
    /**
     * @description: validates the api/create endpoint
     * @param {string} fileName
     * @param {Object} file
     * @return {Object} result
     */

  }, {
    key: 'create',
    value: function create(fileName, file) {
      this.file = '';
      var result = '';

      // if the files array is not empty
      if (file.length !== 0) {
        // if it contains an invalid filename
        if (this.containInvalidFileName(file)) {
          result = { error: 'An Invalid file detected, kindly select a valid file and re-upload!' };

          // delete the uploaded files once the index is created
          this.deleteUploadedFiles(file);
        }
        if (!this.containInvalidFileName(file)) {
          var getCreatedIndex = [];
          var index = {};

          // loop through the files array, create indices and push into indexArray
          file.forEach(function (files) {
            getCreatedIndex.push(_invertedIndex2.default.createIndex(files.originalname, _invertedIndex2.default.validateFile(files.filename)));
          });

          // get each index array and add it to index object
          for (var eachIndex = 0; eachIndex < getCreatedIndex.length; eachIndex += 1) {
            var getObjectInIndex = Object.keys(getCreatedIndex[eachIndex]);
            for (var uploadedFileName = 0; uploadedFileName < getObjectInIndex.length; uploadedFileName += 1) {
              index[getObjectInIndex[uploadedFileName]] = getCreatedIndex[eachIndex][getObjectInIndex[uploadedFileName]];
            }
          }

          // if there is an error key in  the index created and the index length is greater than 1
          if (Object.keys(index).length > 1 && index.error !== undefined) {
            delete index.error;
          }
          result = index;

          // delete uploaded files once the index is created
          this.deleteUploadedFiles(file);
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
        if (searchTerms === undefined) {
          return { error: 'The searchTerms cannot be empty' };
        }
        return _invertedIndex2.default.searchIndex(index, fileName, searchTerms);
      } else {
        if (searchTerms === undefined) {
          return { error: 'The searchTerms cannot be empty' };
        }
        return _invertedIndex2.default.searchIndex(index, searchTerms);
      }
    }
  }]);

  return Validation;
}();

var validation = new Validation();
exports.default = validation;