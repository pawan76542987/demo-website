import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

// Protect routes - JWT Verification
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token missing. Access denied.'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'demo_jwt_secret_key_portfolio_2026';
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

// Authorize roles (e.g. 'seller', 'buyer')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource. Allowed roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};

// Check if a product belongs to the authenticated seller
export const verifySellerProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to modify or delete another seller\'s product.'
      });
    }

    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};
