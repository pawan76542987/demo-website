import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Package'
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Category = mongoose.model('Category', categorySchema);
