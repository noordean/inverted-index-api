[![Build Status](https://travis-ci.org/noordean/inverted-index-api.svg?branch=development)](https://travis-ci.org/noordean/inverted-index-api)
[![Coverage Status](https://coveralls.io/repos/github/noordean/inverted-index-api/badge.svg?branch=master)](https://coveralls.io/github/noordean/inverted-index-api?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b20b01a84bdc40c08cec0ba36021aba9)](https://www.codacy.com/app/noordean/inverted-index-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=noordean/inverted-index-api&amp;utm_campaign=Badge_Grade)
# inverted-index-api
inverted-index-api is an application that enables user to search for text blocks in some certain documents. The
application takes in a valid JSON file, create an index which make then makes searching of text blocks easy and efficient.
## Installation
- Clone this repository to have this app on your machine 
- Then run ```npm install```  to install the dependencies
- Start the server with gulp by running ```gulp serve```
## Usage
Make sure you have created some valid JSON files on your machine to test the API with.
A valid JSON file must have .json extension and must have the following structure:
```[
  {
      “title”: “An inquiry into the wealth of nations”,
      “text”: “This string seeks to help you understand the problem set”
  },
  {
      “title”: “From third world to first world”,
      “text”: “This string is also to help you understand the problem set”
  }
]
```
The API can be tested with postman as described below:
- First make a post request to localhost:3000/api/create to create an index with the following form-data bodies:
  - fileName: It is a text which is the name of the file being uploaded
  - fileContent: It is the file itself
- Search for words by making another request to localhost:3000/api/search with the following form-data bodies:
  - fileName (Optional): The document you want to search from
  - searchTerms: The words you are searching. It can be an array of words.
  
Note: [-1] denotes 'word not found'