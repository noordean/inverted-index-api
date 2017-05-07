'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
var invertedIndex = function () {
  /**
   * having index as object property
   * @constructor
   */
  function invertedIndex() {
    _classCallCheck(this, invertedIndex);

    this.index = {};
  }

  /**
   * @description read the uploaded file
   * @param {string} fileName
   * @return {Object} fileContent
   */


  _createClass(invertedIndex, [{
    key: 'readFile',
    value: function readFile(fileName) {
      try {
        JSON.parse(_fs2.default.readFileSync(_path2.default.join('fixtures', fileName)));
      } catch (e) {
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
      if (Array.isArray(fileContent)) {
        if (fileContent[0] instanceof Object && fileContent[fileContent.length - 1] instanceof Object) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    /**
     * @description validate uploaded fileName
     * @param {string} fileName - The name of the file being uploaded
     * @return {Boolean} true/false
     */

  }, {
    key: 'isValidFileName',
    value: function isValidFileName(fileName) {
      if (fileName.match('.json$') === null) {
        return false;
      } else {
        return true;
      }
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
          var getTokensPerObject = [];
          for (var key in fileContent[i]) {
            var getTokensPerKey = [];
            var getEachKey = fileContent[i][key].toLowerCase().replace(/\W+/g, ' ').split(' ');
            for (var j = 0; j < getEachKey.length; j += 1) {
              if (getTokensPerKey.indexOf(getEachKey[j]) === -1) {
                getTokensPerKey.push(getEachKey[j]);
              }
            }
            for (var k = 0; k < getTokensPerKey.length; k += 1) {
              if (getTokensPerObject.indexOf(getTokensPerKey[k]) === -1) {
                getTokensPerObject.push(getTokensPerKey[k]);
              }
            }
          }
          getAllUniqueTokens.push.apply(getAllUniqueTokens, getTokensPerObject);
        }
        getAllUniqueTokens.sort();
        getAllUniqueTokens.forEach(function (term) {
          if (innerIndex[term] !== undefined) {
            innerIndex[term] = [].concat(_toConsumableArray(innerIndex[term]), [Number(innerIndex[term][innerIndex[term].length - 1] + 1)]);
          } else {
            for (var l = 0; l < fileContent.length; l += 1) {
              for (var keyy in fileContent[l]) {
                if (fileContent[l][keyy].toLowerCase().split(' ').indexOf(term) !== -1) {
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
      } else {
        return { error: 'Index could not be created, Uploaded file must be a valid JSON file and file name must have .json extension' };
      }
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
      var searchResult = {};
      var getSearchTerms = [];

      if (Object.keys(index).length === 0) {
        return { error: 'Index has not been created. Kindly create index before searching' };
      } else {
        if (Array.isArray(fileName)) {
          var _getSearchTerms;

          (_getSearchTerms = getSearchTerms).push.apply(_getSearchTerms, _toConsumableArray(fileName)); // definitly the second arg is seachTerms
        } else {
          getSearchTerms.push(fileName); // definitly the second arg is fileName
        }

        for (var i = 0; i < (arguments.length <= 2 ? 0 : arguments.length - 2); i += 1) {
          if (Array.isArray(arguments.length <= i + 2 ? undefined : arguments[i + 2])) {
            var _getSearchTerms2;

            (_getSearchTerms2 = getSearchTerms).push.apply(_getSearchTerms2, _toConsumableArray(arguments.length <= i + 2 ? undefined : arguments[i + 2]));
          } else {
            getSearchTerms.push(arguments.length <= i + 2 ? undefined : arguments[i + 2]);
          }
        }

        if (getSearchTerms[0].match('.json$') !== null) {
          if (index[getSearchTerms[0]] === undefined) {
            return { error: 'Index has not been created for the specified file' };
          } else {
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
            return searchResult;
          }
        } else {
          // search through all the files in the index object and specify the file in which it's found
          getSearchTerms = getSearchTerms.map(function (data) {
            return data.toLowerCase();
          });
          getSearchTerms.sort();

          var _loop = function _loop(key) {
            var innerResult = {};
            getSearchTerms.forEach(function (val) {
              if (index[key][val] !== undefined) {
                innerResult[val] = index[key][val];
              } else {
                // [-1] specifies 'word not found'
                innerResult[val] = [-1];
              }
            });
            searchResult[key] = innerResult;
          };

          for (var key in index) {
            _loop(key);
          }
          return searchResult;
        }
      }
    }
  }]);

  return invertedIndex;
}();

exports.default = new invertedIndex();