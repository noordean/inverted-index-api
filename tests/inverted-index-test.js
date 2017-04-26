/* i intend to create an instance of invertedIndex class called "index"
 *which would have access to fileContent property,createIndex method,
 *getIndex method, and searchIndex method.
 */

describe('Read book data', () => {
  it('should check if the file content is a valid JSON array', () => {
    expect(Array.isArray(index.fileContent)).toBe(true);
    expect(index.fileContent[0] instanceof Object).toBe(true);
    expect(index.fileContent[index.fileContent.length] instanceof Object).toBe(true);
  });

  it('should check if the JSON array is not empty', () => {
    expect(index.fileContent.length).not.toBe(0);
  });
});

describe('Populate index', () => {
  it('should check if the index created is correct', () => {
    expect(index.getIndex('life')).toEqual([1]);
    expect(index.getIndex('tomorrow')).toEqual([0]);
  });
});

describe('Search index', () => {
  it('should check if search result is correct', () => {
    expect(index.searchIndex('life')).toEqual(['life', [1]]);
    expect(index.searchIndex('tomorrow')).toEqual(['tomorrow', [0]]);   
  });

  it('should check if an array of search terms is handled', () => {
    expect(index.searchIndex(['life', 'tomorrow'])).toEqual([['life', [1]], ['tomorrow', [0]]]);
  });

  it('should check if varied number of search arguments is handled', () => {
    expect(index.searchIndex('life','tomorrow')).toEqual([['life', [1]], ['tomorrow', [0]]]); 
    expect(index.searchIndex('life','tomorrow','is')).toEqual([['life',[1]],["tomorrow", [0]], ['is', [0, 1]]]);
  });

  it('should check for words in both documents', () => {
    expect(index.searchIndex('is')).toEqual([['is', [0,1]]]); 
    expect(index.searchIndex('life', 'is', '')).toEqual([['life',[1]],['is', [0,1]], ["tomorrow", [1]]]); 
  });
});
