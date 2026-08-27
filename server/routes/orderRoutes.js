import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrderByQuery,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public track endpoint
router.get('/track/:query', trackOrderByQuery);

// Protected customer endpoints
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
