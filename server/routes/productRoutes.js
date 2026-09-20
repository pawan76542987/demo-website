import express from 'express';
import {
  getProducts,
  getProductById,
  getHighlights,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerStore
} from '../controllers/productController.js';
import {
  createProductReview,
  getProductReviews
} from '../controllers/reviewController.js';
import { protect, authorize, verifySellerProductOwnership } from '../middleware/auth.js';

const router = express.Router();

// Public Product Routes
router.get('/highlights', getHighlights);
router.get('/seller/:sellerId', getSellerStore);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Reviews on Products
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, authorize('buyer'), createProductReview);

// Seller Product Management Routes
router.post('/', protect, authorize('seller'), createProduct);
router.put('/:id', protect, authorize('seller'), verifySellerProductOwnership, updateProduct);
router.delete('/:id', protect, authorize('seller'), verifySellerProductOwnership, deleteProduct);

export default router;
