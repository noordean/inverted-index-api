import path from 'path';
import fs from 'fs';
import invertedIndexObject from '../src/inverted-index';

/**
 * @description: It does validation inside the routes
 * @class
 */
class Validation {

/**
 * @description: validates the api/create endpoint
 * @param {string} fileName
 * @param {Object} file
 * @return {Object} result
 */
  create(fileName, file) {
    this.file = '';
    let result = '';
    if (file !== undefined) {
      if (file.originalname.match('.json$') === null) {
        result = { error: 'Invalid file uploaded!' };
        fs.unlinkSync(path.join('fixtures', file.filename)); // delete the uploaded file once the index is created
      }
      if (file.originalname.match('.json$') !== null) {
        result = invertedIndexObject.createIndex(fileName,
        invertedIndexObject.readFile(file.filename));
        fs.unlinkSync(path.join('fixtures', file.filename)); // delete the uploaded file once the index is created
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
  search(index, fileName, searchTerms) {
    this.file = '';
    if (fileName !== undefined) {
      if (searchTerms.length === 0) {
        return { error: 'The searchTerms cannot be empty' };
      }
      return invertedIndexObject.searchIndex(index, fileName, searchTerms);
    } else {
      if (searchTerms.length === 0) {
        return { error: 'The searchTerms cannot be empty' };
      }
      return invertedIndexObject.searchIndex(index, searchTerms);
    }
  }
}

export default new Validation();
