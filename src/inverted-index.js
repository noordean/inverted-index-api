class invertedIndex {
  constructor() {
    this.index = {};
    this.fileContent = [
      {
        'title': 'An inquiry into the wealth of nations',
        'text': 'This string seeks to help you understand the problem set'
      },
      {
        'title': 'From third world to first world',
        'text': 'This string is also to help you understand the problem set'
      }
    ];
  }
  readFile() {
  // code to read file here;
  }

  createIndex(fileName) {
    const innerIndex = {};
    for (let i = 0; i < this.fileContent.length; i += 1) {
      for (const key in this.fileContent[i]) {
        this.fileContent[i][key].toLowerCase().replace(/\W+/g, ' ').split(' ').forEach((term) => {
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
  }
  searchIndex(searchTerms) {
    const that = this;
    const searchResult = {};
    const getSearchTerms = [];
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

module.exports = new invertedIndex();
