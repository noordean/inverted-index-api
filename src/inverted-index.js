import fs from 'fs';
import path from 'path';

/**
 * invertedIndex class
 * @class
 */
class InvertedIndex {
/**
 * having index as object property
 * @constructor
 */
  constructor() {
    this.index = {};
    this.fileName = undefined;
    this.fileContent = undefined;
  }


/**
 * @description read the uploaded file
 * @param {string} fileName
 * @return {Object} fileContent
 */
  readFile(fileName) {
    this.file = fileName;
    try {
      JSON.parse(fs.readFileSync(path.join('fixtures', fileName)));
    } catch (e) {
      return 'Invalid JSON file';
    }
    if (JSON.parse(fs.readFileSync(path.join('fixtures', fileName))).length === 0) {
      return 'Empty JSON file';
    } else if (JSON.parse(fs.readFileSync(path.join('fixtures', fileName)))[0].title === undefined ||
    JSON.parse(fs.readFileSync(path.join('fixtures', fileName)))[0].text === undefined) {
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
    this.fileContent = fileContent;
    if (Array.isArray(fileContent)) {
      if ((fileContent[0] instanceof Object) &&
       (fileContent[fileContent.length - 1] instanceof Object)) {
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
  isValidFileName(fileName) {
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
  isEmptyJSON(fileContent) {
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
  isIndexValid(index) {
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
  createIndex(fileName, fileContent) {
    if (this.isValidJSON(fileContent) && this.isValidFileName(fileName)) {
      const innerIndex = {};
      const getAllUniqueTokens = [];
      for (let i = 0; i < fileContent.length; i += 1) {
        const getWordsInEachObject = [];
        const getObjectKeysInFile = Object.keys(fileContent[i]);
        for (let m = 0; m < getObjectKeysInFile.length; m += 1) {
          const getWordsInEachKeyOfEachObject = [];
          const getEachKey = fileContent[i][getObjectKeysInFile[m]].toLowerCase().replace(/\W+/g, ' ').split(' ');
          for (let j = 0; j < getEachKey.length; j += 1) {
            if (getWordsInEachKeyOfEachObject.indexOf(getEachKey[j]) === -1) {
              getWordsInEachKeyOfEachObject.push(getEachKey[j]);
            }
          }
          for (let k = 0; k < getWordsInEachKeyOfEachObject.length; k += 1) {
            if (getWordsInEachObject.indexOf(getWordsInEachKeyOfEachObject[k]) === -1) {
              getWordsInEachObject.push(getWordsInEachKeyOfEachObject[k]);
            }
          }
        }
        getAllUniqueTokens.push(...getWordsInEachObject);
      }
      getAllUniqueTokens.sort();
      getAllUniqueTokens.forEach((term) => {
        if (innerIndex[term] !== undefined) {
          innerIndex[term] = [...innerIndex[term],
            Number(innerIndex[term][innerIndex[term].length - 1] + 1)];
        } else {
          for (let l = 0; l < fileContent.length; l += 1) {
            const getObjKeys = Object.keys(fileContent[l]);
            for (let i = 0; i < getObjKeys.length; i += 1) {
              if (fileContent[l][getObjKeys[i]].toLowerCase().split(' ').indexOf(term) !== -1) {
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
  searchIndex(index, fileName, ...searchTerms) {
    const searchResult = {};
    let getSearchTerms = [];

    if (Object.keys(index).length !== 0 && this.isIndexValid(index)) {
      if (Array.isArray(fileName)) {
        getSearchTerms.push(...fileName); // definitly the second arg is seachTerms
      } else {
        getSearchTerms.push(fileName); // definitely the second arg is fileName
      }

      for (let i = 0; i < searchTerms.length; i += 1) {
        if (Array.isArray(searchTerms[i])) {
          getSearchTerms.push(...searchTerms[i]);
        } else {
          getSearchTerms.push(searchTerms[i]);
        }
      }

      if ((getSearchTerms[0]).match('.json$') !== null) {
        if (index[getSearchTerms[0]] !== undefined) {
          getSearchTerms = getSearchTerms.filter(data =>
            data.match('.json$') === null
          );
          getSearchTerms = getSearchTerms.map(data =>
            data.toLowerCase()
          );
          getSearchTerms.sort();

          getSearchTerms.forEach((val) => {
            if (index[fileName][val] !== undefined) {
              searchResult[val] = index[fileName][val];
            } else {
              // [-1] specifies 'word not found'
              searchResult[val] = [-1];
            }
          });
          return searchResult;
        }
        return { error: 'Index has not been created for the specified file' };
      }
       // search through all the files in the index object and specify the file in which it's found
      getSearchTerms = getSearchTerms.map(data =>
        data.toLowerCase()
      );
      getSearchTerms.sort();
      const getIndexObj = Object.keys(index);
      for (let m = 0; m < getIndexObj.length; m += 1) {
        const innerResult = {};
        getSearchTerms.forEach((val) => {
          if (index[getIndexObj[m]][val] !== undefined) {
            innerResult[val] = index[getIndexObj[m]][val];
          } else {
            // [-1] specifies 'word not found'
            innerResult[val] = [-1];
          }
        });
        searchResult[getIndexObj[m]] = innerResult;
      }
      return searchResult;
    }
    return { error: 'A valid index has not been created. Kindly create index before searching' };
  }
}

export default new InvertedIndex();
// const index = new InvertedIndex();
// console.log(index.readFile('book1.json'));
