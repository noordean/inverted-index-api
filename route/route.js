import express from 'express';
import multer from 'multer';
import invertedIndex from '../src/inverted-index';
import endpointsValidation from './endpoints-validation';

// specify the uploading directory
const upload = multer({ dest: 'fixtures/' }).array('fileContent');
// This is used for search endpoint since no uploading is involved
const search = multer();
const router = express.Router();


// create endpoint
router.post('/api/create', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      throw new Error(err);
    }
    res.json(endpointsValidation.create(req.body.fileName, req.files));
  });
});


// search endpoint
router.post('/api/search', search.single(), (req, res) => {
  res.json(endpointsValidation.search(invertedIndex.bookIndex,
   req.body.fileName, req.body.searchTerms));
});

// display for index page
router.get('/', (req, res) => {
  res.send('Inverted-index-App running...');
});
export default router;
