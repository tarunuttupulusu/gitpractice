import express from 'express';
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getCuratedCollections
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/curated/collections', getCuratedCollections);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

export default router;
