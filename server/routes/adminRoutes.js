import express from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
  toggleUserStatus,
  createCategory,
  deleteCategory,
  getAdminCoupons,
  createCoupon,
  deleteCoupon
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Guard all admin routes with authentication and admin role verification
router.use(protect, adminOnly);

// Dashboard metrics
router.get('/dashboard', getDashboardStats);

// Products management
router.route('/products').get(getAdminProducts).post(createProduct);
router.route('/products/:id').put(updateProduct).delete(deleteProduct);

// Orders management
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Users management
router.get('/users', getAdminUsers);
router.put('/users/:id/status', toggleUserStatus);

// Categories
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

// Coupons
router.route('/coupons').get(getAdminCoupons).post(createCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;
