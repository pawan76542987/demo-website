import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private (Buyer)
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate({
        path: 'products',
        match: { status: 'active' },
        populate: {
          path: 'sellerId',
          select: 'name storeInfo'
        }
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      wishlist: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private (Buyer)
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private (Buyer)
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move wishlist item to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private (Buyer)
export const moveWishlistToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    // Add to cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        sellerId: product.sellerId,
        quantity: 1,
        price: product.price,
        discount: product.discount || 0
      });
    }
    await cart.save();

    // Remove from wishlist
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product moved to cart',
      wishlist: wishlist ? wishlist.products : []
    });
  } catch (error) {
    next(error);
  }
};
