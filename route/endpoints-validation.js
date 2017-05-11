import path from 'path';
import fs from 'fs';
import invertedIndex from '../src/inverted-index';

/**
 * @description: It does validation inside the routes
 * @class
 */
class Validation {


/**
 * @description: delete files after index has been created
 * @param {Object} files
 * @return {Object} nothing
 */
  deleteUploadedFiles(files) {
    this.file = '';
    files.forEach((file) => {
      fs.unlinkSync(path.join('fixtures', file.filename));
    });
  }

/**
 * @description: checks for invalid filename
 * @param {Object} files
 * @return {Boolean} true/false
 */
  containInvalidFileName(files) {
    this.file = files;
    const getInvalidFile = [];
    files.forEach((file) => {
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
  create(fileName, file) {
    this.file = '';
    let result = '';

    // if the files array is not empty
    if (file.length !== 0) {
      // if it contains an invalid filename
      if (this.containInvalidFileName(file)) {
        result = { error: 'An Invalid file detected, kindly select a valid file and re-upload!' };

        // delete the uploaded files once the index is created
        this.deleteUploadedFiles(file);
      }
      if (!this.containInvalidFileName(file)) {
        const getCreatedIndex = [];
        const index = {};

        // loop through the files array, create indices and push into indexArray
        file.forEach((files) => {
          getCreatedIndex.push(invertedIndex.createIndex(files.originalname,
          invertedIndex.validateFile(files.filename)));
        });

        // get each index array and add it to index object
        for (let eachIndex = 0; eachIndex < getCreatedIndex.length; eachIndex += 1) {
          const getObjectInIndex = Object.keys(getCreatedIndex[eachIndex]);
          for (let uploadedFileName = 0; uploadedFileName < getObjectInIndex.length; uploadedFileName += 1) {
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
  search(index, fileName, searchTerms) {
    this.file = '';
    if (fileName !== undefined) {
      if (searchTerms === undefined) {
        return { error: 'The searchTerms cannot be empty' };
      }
      return invertedIndex.searchIndex(index, fileName, searchTerms);
    } else {
      if (searchTerms === undefined) {
        return { error: 'The searchTerms cannot be empty' };
      }
      return invertedIndex.searchIndex(index, searchTerms);
    }
  }
}

const validation = new Validation();
export default validation;
