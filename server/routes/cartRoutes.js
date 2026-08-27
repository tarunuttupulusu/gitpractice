import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes require auth

router.route('/').get(getCart);
router.route('/items').post(addToCart);
router.route('/items/:itemId').put(updateCartItem).delete(removeFromCart);
router.route('/apply-coupon').post(applyCoupon);
router.route('/remove-coupon').delete(removeCoupon);
router.route('/clear').delete(clearCart);

export default router;
