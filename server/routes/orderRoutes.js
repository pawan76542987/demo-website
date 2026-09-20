import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Order creation, buyer history, cancellation
router.post('/', authorize('buyer'), createOrder);
router.get('/', authorize('buyer'), getMyOrders);
router.get('/:id', getOrderById); // Accessible by buyer or involved seller
router.put('/:id/cancel', authorize('buyer'), cancelOrder);

export default router;
