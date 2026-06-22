import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/addresses').post(protect, addAddress);
router.route('/addresses/:id').delete(protect, deleteAddress);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
