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
    this.bookIndex = {};
    this.fileName = undefined;
    this.fileContent = undefined;
  }


/**
 * @description read/validate the uploaded file
 * @param {string} fileName
 * @return {Object} fileContent
 */
  validateFile(fileName) {
    const isMalformed = (file) => {
      const getMalformedFile = [];
      if (Array.isArray(file)) {
        file.forEach((content) => {
          if (content.title === undefined || content.text === undefined) {
            getMalformedFile.push('error');
          }
        });
      }
      if (getMalformedFile.length > 0) {
        return true;
      }
      return false;
    };

    this.file = fileName;
    try {
      JSON.parse(fs.readFileSync(path.join('fixtures', fileName)));
    } catch (e) {
      return 'Invalid JSON file';
    }
    if (JSON.parse(fs.readFileSync(path.join('fixtures', fileName))).length === 0) {
      return 'Empty JSON file';
    } else if (isMalformed(JSON.parse(fs.readFileSync(path.join('fixtures', fileName))))) {
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
    // a function that checks if fileContent array contains mainly objects
    const isObject = (contents) => {
      const getNonObject = [];
      contents.forEach((content) => {
        if (!(content instanceof Object)) {
          getNonObject.pull(content);
        }
      });
      if (getNonObject.length > 0) {
        return false;
      }
      return true;
    };

    // checks if fileContent is valid JSON array, then if it contains objects as elements
    this.fileContent = fileContent;
    if (Array.isArray(fileContent)) {
      if (isObject(fileContent)) {
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
 * @description: checks for a valid index format
 * @param {Object} index - The index created from the uploaded file
 * @return {Boolean} true/false
 */
  isIndexValid(index) {
    this.fileName = '';
    if ((index instanceof Object) && index.error === undefined) {
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
      const createdIndex = {};
      const getAllUniqueTokens = [];

      // a function that returns all unique words in a document
      const uniqueDocumentWords = (content) => {
        const wordsPerDocument = [];
        const documentKeys = Object.keys(content);
        for (let documentKey = 0; documentKey < documentKeys.length; documentKey += 1) {
          const uniqueWordsPerDocumentKey = [];
          const allWordsPerDocumentKey = content[documentKeys[documentKey]].toLowerCase().replace(/\W+/g, ' ').split(' ');
          for (let wordPerKey = 0; wordPerKey < allWordsPerDocumentKey.length; wordPerKey += 1) {
            if (uniqueWordsPerDocumentKey.indexOf(allWordsPerDocumentKey[wordPerKey]) === -1) {
              uniqueWordsPerDocumentKey.push(allWordsPerDocumentKey[wordPerKey]);
            }
          }

          for (let uniqueWord = 0; uniqueWord < uniqueWordsPerDocumentKey.length; uniqueWord += 1) {
            if (wordsPerDocument.indexOf(uniqueWordsPerDocumentKey[uniqueWord]) === -1) {
              wordsPerDocument.push(uniqueWordsPerDocumentKey[uniqueWord]);
            }
          }
        }
        return wordsPerDocument;
      };

      for (let document = 0; document < fileContent.length; document += 1) {
        getAllUniqueTokens.push(...uniqueDocumentWords(fileContent[document]));
      }

      getAllUniqueTokens.sort();

      getAllUniqueTokens.forEach((term) => {
        if (createdIndex[term] !== undefined) {
          createdIndex[term] = [...createdIndex[term],
            Number(createdIndex[term][createdIndex[term].length - 1] + 1)];
        } else {
          for (let document = 0; document < fileContent.length; document += 1) {
            const documentKeys = Object.keys(fileContent[document]);
            for (let key = 0; key < documentKeys.length; key += 1) {
              if (fileContent[document][documentKeys[key]].toLowerCase().split(' ').indexOf(term) !== -1) {
                if (createdIndex[term] === undefined) {
                  createdIndex[term] = [document];
                }
              }
            }
          }
        }
      });
      this.bookIndex[fileName] = createdIndex;
      return this.bookIndex;
    } else if (this.validateFile(fileContent) === 'Empty JSON file') {
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
        return { error: 'Index has not been created for the specified file, kindly create an index for it' };
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
            // [] specifies 'word not found'
            innerResult[val] = [];
          }
        });
        searchResult[getIndexObj[m]] = innerResult;
      }
      return searchResult;
    }
    return { error: 'A valid index has not been created. Kindly create index before searching' };
  }
}

const InvertedIndexObject = new InvertedIndex();
export default InvertedIndexObject;
