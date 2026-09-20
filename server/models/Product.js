import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product must belong to a seller'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [180, 'Product name cannot exceed 180 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [99, 'Discount cannot exceed 99%']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide available stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    validate: {
      validator: function(val) {
        return val && val.length > 0;
      },
      message: 'Product must have at least one image'
    }
  },
  specifications: [specificationSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted selling price
productSchema.virtual('sellingPrice').get(function() {
  if (!this.discount || this.discount <= 0) return this.price;
  const discounted = this.price - (this.price * (this.discount / 100));
  return Math.round(discounted * 100) / 100;
});

// Text index for full-text search across name, brand, category, and description
productSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text',
  description: 'text'
}, {
  weights: {
    name: 10,
    brand: 5,
    category: 3,
    description: 1
  },
  name: 'ProductTextIndex'
});

export const Product = mongoose.model('Product', productSchema);
