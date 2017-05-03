'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //const fs = require('fs');


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var invertedIndex = function () {
  function invertedIndex() {
    _classCallCheck(this, invertedIndex);

    this.index = {};
  }

  _createClass(invertedIndex, [{
    key: 'isValidJSON',
    value: function isValidJSON(fileName) {
      try {
        JSON.parse(_fs2.default.readFileSync('./fixtures/' + fileName));
      } catch (e) {
        return false;
      }
      return true;
    }
  }, {
    key: 'readFile',
    value: function readFile(fileName) {
      if (this.isValidJSON(fileName)) {
        return JSON.parse(_fs2.default.readFileSync('./fixtures/' + fileName));
      } else {
        return 'Invalid JSON file';
      }
    }
  }, {
    key: 'createIndex',
    value: function createIndex(fileName) {
      var _this = this;

      if (this.readFile(fileName) !== 'Invalid JSON file') {
        var _ret = function () {
          var innerIndex = {};

          var _loop = function _loop(i) {
            for (var key in _this.readFile(fileName)[i]) {
              _this.readFile(fileName)[i][key].toLowerCase().replace(/\W+/g, ' ').split(' ').forEach(function (term) {
                if (innerIndex[term] !== undefined) {
                  if (innerIndex[term].length < 2 && innerIndex[term][0] === 0) {
                    innerIndex[term].push(1);
                  }
                } else {
                  innerIndex[term] = [i];
                }
              });
            }
          };

          for (var i = 0; i < _this.readFile(fileName).length; i += 1) {
            _loop(i);
          }
          _this.index[fileName] = innerIndex;
          return {
            v: _this.index
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else {
        return { 'error': 'Index could not be created, invalid JSON file selected' };
      }
    }
  }, {
    key: 'searchIndex',
    value: function searchIndex() {
      var _arguments = arguments;

      var that = this;
      var searchResult = {};
      var getSearchTerms = [];
      /* If  a fileName is specified as first argument
       * search the searchTerms in the specified fileName
       * if the word(token) is present in the object,
       * include its index value in searchResult object
       * else include [-1] as its index value which  signifies 'word not found'
       */
      if (Object.keys(this.index).length === 0) {
        return { 'error': 'Index has not been created. Kindly create index before searching' };
      } else {
        // if (!Array.isArray(arguments[0]))
        if (!Array.isArray(arguments[0]) && arguments[0].match('.json$') !== null) {
          if (this.index[arguments[0]] === undefined) {
            return { 'error': 'Index has not been created for the specified file' };
          } else {
            for (var i = 1; i < arguments.length; i += 1) {
              if (Array.isArray(arguments[i])) {
                arguments[i].forEach(function (value) {
                  getSearchTerms.push(value.toLowerCase());
                });
              } else {
                getSearchTerms.push(arguments[i].toLowerCase());
              }
            }

            getSearchTerms.forEach(function (val) {
              if (that.index[_arguments[0]][val] !== undefined) {
                searchResult[val] = that.index[_arguments[0]][val];
              } else {
                searchResult[val] = [-1];
              }
            });
            return searchResult;
          }
        } else {
          /* consider the whole arguments as search terms
           * and search through all the fileNames in the index object
           */
          for (var _i = 0; _i < arguments.length; _i += 1) {
            if (Array.isArray(arguments[_i])) {
              arguments[_i].forEach(function (value) {
                getSearchTerms.push(value.toLowerCase());
              });
            } else {
              getSearchTerms.push(arguments[_i].toLowerCase());
            }
          }

          var _loop2 = function _loop2(key) {
            getSearchTerms.forEach(function (val) {
              if (that.index[key][val] !== undefined) {
                searchResult[val] = that.index[key][val];
              } else {
                searchResult[val] = [-1];
              }
            });
          };

          for (var key in this.index) {
            _loop2(key);
          }
          return searchResult;
        }
      }
    }
  }]);

  return invertedIndex;
}();

module.exports = new invertedIndex();