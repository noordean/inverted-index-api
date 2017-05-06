import fs from 'fs';
import path from 'path';

/**
 * invertedIndex class
 * @class
 */
class invertedIndex {
/**
 * having index as object property
 * @constructor
 */
  constructor() {
    this.index = {};
  }


/**
 * @description read the uploaded file
 * @param {string} fileName
 * @return {Object} fileContent
 */
  readFile(fileName) {
    try {
      JSON.parse(fs.readFileSync(path.join('fixtures', fileName)));
    }
    catch (e) {
      return 'Malformed JSON file';
    }
    return JSON.parse(fs.readFileSync(path.join('fixtures', fileName)));
  }

/**
 * @description validate uploaded file
 * @param {Object} fileContent - The content of the file being uploaded
 * @return {Boolean} true/false
 */
  isValidJSON(fileContent) {
    if (Array.isArray(fileContent)) {
      if ((fileContent[0] instanceof Object) && (fileContent[fileContent.length - 1] instanceof Object)) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

/**
 * @description validate uploaded fileName
 * @param {string} fileName - The name of the file being uploaded
 * @return {Boolean} true/false
 */
  isValidFileName(fileName) {
    if (fileName.match('.json$') === null) {
      return false;
    }
    else {
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
  createIndex(fileName, fileContent) {
    if (this.isValidJSON(fileContent) && this.isValidFileName(fileName)) {
      const innerIndex = {};
      const getAllUniqueTokens = [];
      for (let i = 0; i < fileContent.length; i += 1){
        const getTokensPerObject = [];
        for (const key in fileContent[i]) {
          const getTokensPerKey = [];
          const getEachKey = fileContent[i][key].toLowerCase().replace(/\W+/g, ' ').split(' ');
          for (let j = 0; j < getEachKey.length; j += 1){
            if (getTokensPerKey.indexOf(getEachKey[j]) === -1){
              getTokensPerKey.push(getEachKey[j]);
            }
          }
          for (let k = 0; k < getTokensPerKey.length; k += 1) {
            if (getTokensPerObject.indexOf(getTokensPerKey[k]) === -1) {
              getTokensPerObject.push(getTokensPerKey[k]);
            }
          }
        }
        getAllUniqueTokens.push(...getTokensPerObject);
      }
      getAllUniqueTokens.sort();
      getAllUniqueTokens.forEach((term) => {
        if (innerIndex[term] !== undefined) {
          innerIndex[term] = [...innerIndex[term], Number(innerIndex[term][innerIndex[term].length - 1] + 1)];
          }
        else {
          for (let l = 0; l < fileContent.length; l += 1){
            for (const keyy in fileContent[l]){
              if (fileContent[l][keyy].toLowerCase().split(' ').indexOf(term) !== -1){
                if (innerIndex[term] === undefined){
                  innerIndex[term] = [l];
                }
              }
            }
          }
        }
      });
      this.index[fileName] = innerIndex;
      return this.index;
    }
    else {
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
  searchIndex(index, fileName, ...searchTerms) {
    const searchResult = {};
    let getSearchTerms = [];

    if (Object.keys(index).length === 0) {
      return { error: 'Index has not been created. Kindly create index before searching' };
    }
    else {
      if (Array.isArray(fileName)) {
        getSearchTerms.push(...fileName); // definitly the second arg is seachTerms
      }
      else {
        getSearchTerms.push(fileName); // definitly the second arg is fileName
      }

      for (let i = 0; i < searchTerms.length; i += 1) {
        if (Array.isArray(searchTerms[i])) {
          getSearchTerms.push(...searchTerms[i]);
        }
        else {
          getSearchTerms.push(searchTerms[i]);
        }
      }

      if ((getSearchTerms[0]).match('.json$') !== null) {
        if (index[getSearchTerms[0]] === undefined) {
          return { error: 'Index has not been created for the specified file' };
        }
        else {
          getSearchTerms = getSearchTerms.filter((data) => {
            return data.match('.json$') === null;
          });
          getSearchTerms = getSearchTerms.map((data) => {
            return data.toLowerCase();
          });
          getSearchTerms.sort();

          getSearchTerms.forEach((val) => {
            if (index[fileName][val] !== undefined) {
              searchResult[val] = index[fileName][val];
            }
            else {
              // [-1] specifies 'word not found'
              searchResult[val] = [-1];
            }
          });
          return searchResult;
        }
      }
      else {
       // search through all the files in the index object and specify the file in which it's found
        getSearchTerms = getSearchTerms.map((data) => {
          return data.toLowerCase();
        });
        getSearchTerms.sort();

        for (const key in index) {
          const innerResult = {};
          getSearchTerms.forEach((val) => {
            if (index[key][val] !== undefined) {
              innerResult[val] = index[key][val];
            }
            else {
              // [-1] specifies 'word not found'
              innerResult[val] = [-1];
            }
          });
          searchResult[key] = innerResult;
        }
        return searchResult;
      }
    }
  }
}

export default new invertedIndex();

