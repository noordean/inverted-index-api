'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * invertedIndex class
 * @class
 */
var InvertedIndex = function () {
  /**
   * having index as object property
   * @constructor
   */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.index = {};
    this.fileName = undefined;
    this.fileContent = undefined;
  }

  /**
   * @description read the uploaded file
   * @param {string} fileName
   * @return {Object} fileContent
   */


  _createClass(InvertedIndex, [{
    key: 'readFile',
    value: function readFile(fileName) {
      this.file = fileName;
      try {
        JSON.parse(_fs2.default.readFileSync(_path2.default.join('fixtures', fileName)));
      } catch (e) {
        return 'Invalid JSON file';
      }
      if (JSON.parse(_fs2.default.readFileSync(_path2.default.join('fixtures', fileName))).length === 0) {
        return 'Empty JSON file';
      } else if (JSON.parse(_fs2.default.readFileSync(_path2.default.join('fixtures', fileName)))[0].title === undefined || JSON.parse(_fs2.default.readFileSync(_path2.default.join('fixtures', fileName)))[0].text === undefined) {
        return 'Malformed JSON file';
      }
      return JSON.parse(_fs2.default.readFileSync(_path2.default.join('fixtures', fileName)));
    }
    /**
     * @description validate uploaded file
     * @param {Object} fileContent - The content of the file being uploaded
     * @return {Boolean} true/false
     */

  }, {
    key: 'isValidJSON',
    value: function isValidJSON(fileContent) {
      this.fileContent = fileContent;
      if (Array.isArray(fileContent)) {
        if (fileContent[0] instanceof Object && fileContent[fileContent.length - 1] instanceof Object) {
          return true;
        }
        return false;
      }
      return false;
    }

    /**
     * @description validate uploaded fileName
     * @param {string} fileName - The name of the file being uploaded
     * @return {Boolean} true/false
     */

  }, {
    key: 'isValidFileName',
    value: function isValidFileName(fileName) {
      this.fileName = fileName;
      if (fileName.match('.json$') === null) {
        return false;
      }
      return true;
    }

    /**
     * @description: checks for empty file array
     * @param {Object} fileContent - The content of the file being uploaded
     * @return {Boolean} true/false
     */

  }, {
    key: 'isEmptyJSON',
    value: function isEmptyJSON(fileContent) {
      this.fileContent = fileContent;
      if (fileContent.length === 0) {
        return true;
      }
      return false;
    }

    /**
     * @description: checks for a valid index format
     * @param {Object} index - The index created from the uploaded file
     * @return {Boolean} true/false
     */

  }, {
    key: 'isIndexValid',
    value: function isIndexValid(index) {
      this.fileName = '';
      if (index instanceof Object) {
        if (!Array.isArray(index)) {
          return true;
        }
        return false;
      }
      return false;
    }
    /**
     * @description: Loop through the uploaded JSON file,convert each key-value to lowercase,
     * split, trim, check for duplicate per object element, create innerIndex and
     * add it to the object index
     * @param {string} fileName
     * @param {Object} fileContent
     * @return {Object} this.index
     */

  }, {
    key: 'createIndex',
    value: function createIndex(fileName, fileContent) {
      if (this.isValidJSON(fileContent) && this.isValidFileName(fileName)) {
        var innerIndex = {};
        var getAllUniqueTokens = [];
        for (var i = 0; i < fileContent.length; i += 1) {
          var getWordsInEachObject = [];
          var getObjectKeysInFile = Object.keys(fileContent[i]);
          for (var m = 0; m < getObjectKeysInFile.length; m += 1) {
            var getWordsInEachKeyOfEachObject = [];
            var getEachKey = fileContent[i][getObjectKeysInFile[m]].toLowerCase().replace(/\W+/g, ' ').split(' ');
            for (var j = 0; j < getEachKey.length; j += 1) {
              if (getWordsInEachKeyOfEachObject.indexOf(getEachKey[j]) === -1) {
                getWordsInEachKeyOfEachObject.push(getEachKey[j]);
              }
            }
            for (var k = 0; k < getWordsInEachKeyOfEachObject.length; k += 1) {
              if (getWordsInEachObject.indexOf(getWordsInEachKeyOfEachObject[k]) === -1) {
                getWordsInEachObject.push(getWordsInEachKeyOfEachObject[k]);
              }
            }
          }
          getAllUniqueTokens.push.apply(getAllUniqueTokens, getWordsInEachObject);
        }
        getAllUniqueTokens.sort();
        getAllUniqueTokens.forEach(function (term) {
          if (innerIndex[term] !== undefined) {
            innerIndex[term] = [].concat(_toConsumableArray(innerIndex[term]), [Number(innerIndex[term][innerIndex[term].length - 1] + 1)]);
          } else {
            for (var l = 0; l < fileContent.length; l += 1) {
              var getObjKeys = Object.keys(fileContent[l]);
              for (var _i = 0; _i < getObjKeys.length; _i += 1) {
                if (fileContent[l][getObjKeys[_i]].toLowerCase().split(' ').indexOf(term) !== -1) {
                  if (innerIndex[term] === undefined) {
                    innerIndex[term] = [l];
                  }
                }
              }
            }
          }
        });
        this.index[fileName] = innerIndex;
        return this.index;
      } else if (this.isEmptyJSON(fileContent)) {
        return { error: 'Index could not be created, an empty file uploaded' };
      }
      return { error: 'Index could not be created, uploaded file must be a valid JSON file and file name must have .json extension' };
    }

    /**
     * @description: The searchTerms is flattened, if a fileName is supplied,
     * the search looks through the specified file, else it checks
     * through the whole index object
     * @param {Object} index : The created index
     * @param {string} fileName : Name of file to search
     * @return {Object} searchResult
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(index, fileName) {
      var _arguments = arguments;

      var searchResult = {};
      var getSearchTerms = [];

      if (Object.keys(index).length !== 0 && this.isIndexValid(index)) {
        var _ret = function () {
          if (Array.isArray(fileName)) {
            var _getSearchTerms;

            (_getSearchTerms = getSearchTerms).push.apply(_getSearchTerms, _toConsumableArray(fileName)); // definitly the second arg is seachTerms
          } else {
            getSearchTerms.push(fileName); // definitely the second arg is fileName
          }

          for (var i = 0; i < (_arguments.length <= 2 ? 0 : _arguments.length - 2); i += 1) {
            if (Array.isArray(_arguments.length <= i + 2 ? undefined : _arguments[i + 2])) {
              var _getSearchTerms2;

              (_getSearchTerms2 = getSearchTerms).push.apply(_getSearchTerms2, _toConsumableArray(_arguments.length <= i + 2 ? undefined : _arguments[i + 2]));
            } else {
              getSearchTerms.push(_arguments.length <= i + 2 ? undefined : _arguments[i + 2]);
            }
          }

          if (getSearchTerms[0].match('.json$') !== null) {
            if (index[getSearchTerms[0]] !== undefined) {
              getSearchTerms = getSearchTerms.filter(function (data) {
                return data.match('.json$') === null;
              });
              getSearchTerms = getSearchTerms.map(function (data) {
                return data.toLowerCase();
              });
              getSearchTerms.sort();

              getSearchTerms.forEach(function (val) {
                if (index[fileName][val] !== undefined) {
                  searchResult[val] = index[fileName][val];
                } else {
                  // [-1] specifies 'word not found'
                  searchResult[val] = [-1];
                }
              });
              return {
                v: searchResult
              };
            }
            return {
              v: { error: 'Index has not been created for the specified file' }
            };
          }
          // search through all the files in the index object and specify the file in which it's found
          getSearchTerms = getSearchTerms.map(function (data) {
            return data.toLowerCase();
          });
          getSearchTerms.sort();
          var getIndexObj = Object.keys(index);

          var _loop = function _loop(m) {
            var innerResult = {};
            getSearchTerms.forEach(function (val) {
              if (index[getIndexObj[m]][val] !== undefined) {
                innerResult[val] = index[getIndexObj[m]][val];
              } else {
                // [-1] specifies 'word not found'
                innerResult[val] = [-1];
              }
            });
            searchResult[getIndexObj[m]] = innerResult;
          };

          for (var m = 0; m < getIndexObj.length; m += 1) {
            _loop(m);
          }
          return {
            v: searchResult
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
      return { error: 'A valid index has not been created. Kindly create index before searching' };
    }
  }]);

  return InvertedIndex;
}();

exports.default = new InvertedIndex();
// const index = new InvertedIndex();
// console.log(index.readFile('book1.json'));