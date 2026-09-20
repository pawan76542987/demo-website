import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Enforce one review per product per buyer
reviewSchema.index({ productId: 1, buyerId: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
