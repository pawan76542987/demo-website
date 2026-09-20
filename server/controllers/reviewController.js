import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

// @desc    Add or update a product review
// @route   POST /api/products/:id/reviews
// @access  Private (Verified Buyer)
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, title } = req.body;
    const productId = req.params.id;
    const buyerId = req.user._id;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5'
      });
    }

    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a review comment'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Verify Purchaser: Check if user has purchased this product
    const eligibleOrder = await Order.findOne({
      buyerId,
      'items.productId': productId,
      orderStatus: { $ne: 'Cancelled' }
    });

    if (!eligibleOrder) {
      return res.status(403).json({
        success: false,
        message: 'Only verified purchasers can submit a review for this product.'
      });
    }

    // Check if review already exists from this buyer
    let review = await Review.findOne({ productId, buyerId });

    if (review) {
      // Update existing review
      review.rating = Number(rating);
      review.comment = comment;
      review.title = title || review.title;
      await review.save();
    } else {
      // Create new review
      review = await Review.create({
        productId,
        buyerId,
        orderId: eligibleOrder._id,
        rating: Number(rating),
        title: title || '',
        comment,
        buyerName: req.user.name,
        isVerifiedPurchase: true
      });
    }

    // Recalculate average rating & review count for the product
    const allReviews = await Review.find({ productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

    product.rating = avgRating;
    product.reviewCount = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
      productRating: product.rating,
      reviewCount: product.reviewCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product with rating statistics
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      ratingDistribution[rounded] = (ratingDistribution[rounded] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      ratingDistribution,
      reviews
    });
  } catch (error) {
    next(error);
  }
};
