import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('buyer'));

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItemQuantity);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

export default router;
