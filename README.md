[![Build Status](https://travis-ci.org/noordean/inverted-index-api.svg?branch=development)](https://travis-ci.org/noordean/inverted-index-api)
[![Coverage Status](https://coveralls.io/repos/github/noordean/inverted-index-api/badge.svg?branch=server-side)](https://coveralls.io/github/noordean/inverted-index-api?branch=server-side)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b20b01a84bdc40c08cec0ba36021aba9)](https://www.codacy.com/app/noordean/inverted-index-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=noordean/inverted-index-api&amp;utm_campaign=Badge_Grade)
# inverted-index-api
inverted-index-api is an application that enables user to search for text blocks in some certain documents. The
application takes in a valid JSON file, create an index which make then makes searching of text blocks easy and efficient.
## Installation
- Clone this repository to have this app with ```git clone https://github.com/noordean/inverted-index-api.git```
- Then run ```npm install```  to install the dependencies
- Start the server with gulp by running ```gulp serve```
## Usage
Make sure you have created some valid JSON files on your machine to test the API.
A valid JSON file must have .json extension and must have a similar structure with the following:
```
[
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
  - fileContent: It is the file itself, which should be uploaded from your machine
- Search for words by making another request to localhost:3000/api/search with the following form-data bodies:
  - fileName (Optional): The document you want to search from
  - searchTerms: The words you are searching. It can be an array of words
  
The API can also be tested with the hosted version at ```not available yet url``` by following exactly the above steps.

### Note:
A valid index has a similar structure with the following:
   ``` 
  {
    'book2.json': {
      also: [1],
      an: [0],
      first: [1],
      from: [1],
      help: [0, 1],
      inquiry: [0],
      into: [0],
      is: [1],
      nations: [0],
      of: [0],
      problem: [0, 1],
      seeks: [0],
      set: [0, 1],
      string: [0, 1],
      the: [0, 1],
      third: [1],
      this: [0, 1],
      to: [0, 1],
      understand: [0, 1],
      wealth: [0],
      world: [1],
      you: [0, 1]
    }
  }
  ```
A valid search response through the above index with search terms ['nations', 'understand'] would be:
  ```
  {
    nations: [0, 1],
    understand: [1]
  }
  ```
