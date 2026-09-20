import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Buyer Address Routes
router.post('/addresses', protect, authorize('buyer'), addAddress);
router.delete('/addresses/:addressId', protect, authorize('buyer'), deleteAddress);
router.put('/addresses/:addressId/default', protect, authorize('buyer'), setDefaultAddress);

export default router;
