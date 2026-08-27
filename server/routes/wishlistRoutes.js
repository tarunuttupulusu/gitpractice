import express from 'express';
import {
  getWishlist,
  toggleWishlist,
  moveToCart
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All wishlist routes require auth

router.route('/').get(getWishlist);
router.route('/toggle').post(toggleWishlist);
router.route('/move-to-cart').post(moveToCart);

export default router;
