import express from 'express';
import {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  updateSellerOrderStatus,
  updateQuickStock
} from '../controllers/sellerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('seller'));

router.get('/dashboard', getSellerDashboard);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.put('/orders/:orderId/status', updateSellerOrderStatus);
router.put('/inventory/:productId', updateQuickStock);

export default router;
