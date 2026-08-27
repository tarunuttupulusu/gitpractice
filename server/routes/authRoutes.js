import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/addresses').post(protect, addUserAddress);
router.route('/addresses/:id').delete(protect, deleteUserAddress);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
