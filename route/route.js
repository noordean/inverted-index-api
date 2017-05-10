import express from 'express';
import multer from 'multer';
import invertedIndexObject from '../src/inverted-index';
import validationObject from './endpoints-validation';

const upload = multer({ dest: 'fixtures/' }).single('fileContent'); // specify the uploading directory
const search = multer();       // This is used for search endpoint since no uploading is involved
const router = express.Router();


// create endpoint
router.post('/api/create', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      throw new Error(err);
    }
    res.json(validationObject.create(req.body.fileName, req.file));
  });
});


// search endpoint
router.post('/api/search', search.single(), (req, res) => {
  res.json(validationObject.search(invertedIndexObject.index,
   req.body.fileName, req.body.searchTerms));
});

export default router;
