//const fs = require('fs');
import fs from 'fs';

class invertedIndex {
  constructor() {
    this.index = {};
  }

  isValidJSON(fileName) {
    try {
      JSON.parse(fs.readFileSync('./fixtures/' + fileName));
    } catch (e) {
      return false;
    }
    return true;
  }

  readFile(fileName) {
    if (this.isValidJSON(fileName)) {
      return JSON.parse(fs.readFileSync('./fixtures/' + fileName));
    }
    else {
      return 'Invalid JSON file';
    }
  }

  createIndex(fileName) {
    if (this.readFile(fileName) !== 'Invalid JSON file'){
      const innerIndex = {};
      for (let i = 0; i < this.readFile(fileName).length; i += 1) {
        for (const key in this.readFile(fileName)[i]) {
          this.readFile(fileName)[i][key].toLowerCase().replace(/\W+/g, ' ').split(' ').forEach((term) => {
            if (innerIndex[term] !== undefined) {
              if (innerIndex[term].length < 2 && innerIndex[term][0] === 0) {
                innerIndex[term].push(1);
              }
            }
            else {
              innerIndex[term] = [i];
            }
          });
        }
      }
      this.index[fileName] = innerIndex;
      return this.index;
    }
    else {
      return { 'error': 'Index could not be created, invalid JSON file selected'};
    }
  }

  searchIndex() {
    const that = this;
    const searchResult = {};
    const getSearchTerms = [];
        /* If  a fileName is specified as first argument
         * search the searchTerms in the specified fileName
         * if the word(token) is present in the object,
         * include its index value in searchResult object
         * else include [-1] as its index value which  signifies 'word not found'
         */
    if (Object.keys(this.index).length === 0) {
      return { 'error': 'Index has not been created. Kindly create index before searching' }
    }
    else {
      // if (!Array.isArray(arguments[0]))
      if (!Array.isArray(arguments[0]) && arguments[0].match('.json$') !== null) {
        if (this.index[arguments[0]] === undefined){
          return { 'error': 'Index has not been created for the specified file' };
        }
        else {
          for (let i = 1; i < arguments.length; i += 1) {
            if (Array.isArray(arguments[i])) {
              arguments[i].forEach((value) => {
                getSearchTerms.push(value.toLowerCase());
              });
            }
            else {
              getSearchTerms.push(arguments[i].toLowerCase());
            }
          }

          getSearchTerms.forEach((val) => {
            if (that.index[arguments[0]][val] !== undefined) {
              searchResult[val] = that.index[arguments[0]][val];
            }
            else {
              searchResult[val] = [-1];
            }
          });
          return searchResult;
        }
      }
      else {
      /* consider the whole arguments as search terms
       * and search through all the fileNames in the index object
       */
        for (let i = 0; i < arguments.length; i += 1) {
          if (Array.isArray(arguments[i])) {
            arguments[i].forEach((value) => {
              getSearchTerms.push(value.toLowerCase());
            });
          }
          else {
            getSearchTerms.push(arguments[i].toLowerCase());
          }
        }

        for (const key in this.index) {
          getSearchTerms.forEach((val) => {
            if (that.index[key][val] !== undefined) {
              searchResult[val] = that.index[key][val];
            }
            else {
              searchResult[val] = [-1];
            }
          });
        }
        return searchResult;
      }
    }
  }
}

module.exports = new invertedIndex();
