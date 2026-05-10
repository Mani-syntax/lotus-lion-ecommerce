const express = require('express');
const {
  getCollections,
  getCollectionBySlug,
  getCollectionProducts
} = require('../controllers/collectionController');

const router = express.Router();

// Get all collections
router.get('/', getCollections);

// Get products for a specific collection (Men's/Women's pages)
router.get('/:slug/products', getCollectionProducts);

// Get a specific collection by slug
router.get('/:slug', getCollectionBySlug);

module.exports = router;
