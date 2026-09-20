import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveWishlistToCart
} from '../controllers/wishlistController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('buyer'));

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.post('/:productId/move-to-cart', moveWishlistToCart);

export default router;
