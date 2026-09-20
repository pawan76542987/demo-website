import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

// Helper to format and calculate cart totals
const formatCartResponse = async (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      deliveryFee: 0,
      total: 0,
      itemCount: 0
    };
  }

  // Populate product details
  await cart.populate({
    path: 'items.productId',
    select: 'name price discount images stock status sellerId brand',
    populate: {
      path: 'sellerId',
      select: 'name storeInfo'
    }
  });

  // Filter out any items where product no longer exists
  const validItems = cart.items.filter(item => item.productId && item.productId.status === 'active');
  
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  let subtotal = 0;
  let totalDiscount = 0;
  let itemCount = 0;

  const formattedItems = validItems.map(item => {
    const prod = item.productId;
    const originalPrice = prod.price;
    const discountPercent = prod.discount || 0;
    const effectivePrice = discountPercent > 0 
      ? Math.round((originalPrice - (originalPrice * (discountPercent / 100))) * 100) / 100
      : originalPrice;

    const itemSubtotal = originalPrice * item.quantity;
    const itemTotal = effectivePrice * item.quantity;
    const itemSavings = itemSubtotal - itemTotal;

    subtotal += itemSubtotal;
    totalDiscount += itemSavings;
    itemCount += item.quantity;

    return {
      _id: item._id,
      product: {
        _id: prod._id,
        name: prod.name,
        price: prod.price,
        discount: prod.discount,
        sellingPrice: effectivePrice,
        image: prod.images && prod.images.length > 0 ? prod.images[0] : '',
        stock: prod.stock,
        brand: prod.brand,
        seller: prod.sellerId ? {
          _id: prod.sellerId._id,
          name: prod.sellerId.name,
          storeName: prod.sellerId.storeInfo?.storeName || prod.sellerId.name
        } : null
      },
      sellerId: item.sellerId,
      quantity: item.quantity,
      price: originalPrice,
      discount: discountPercent,
      effectivePrice,
      itemTotal: Math.round(itemTotal * 100) / 100
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;
  totalDiscount = Math.round(totalDiscount * 100) / 100;
  // Free delivery for orders above ₹499, otherwise ₹40
  const totalAfterDiscount = subtotal - totalDiscount;
  const deliveryFee = totalAfterDiscount > 499 || totalAfterDiscount === 0 ? 0 : 40;
  const grandTotal = Math.round((totalAfterDiscount + deliveryFee) * 100) / 100;

  return {
    _id: cart._id,
    items: formattedItems,
    subtotal,
    discount: totalDiscount,
    deliveryFee,
    total: grandTotal,
    itemCount
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private (Buyer)
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const formattedCart = await formatCartResponse(cart);
    res.status(200).json({
      success: true,
      cart: formattedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private (Buyer)
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const requestedQty = Math.max(1, parseInt(quantity, 10));

    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or is no longer active'
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently out of stock'
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + requestedQty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.stock}`
        });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price;
      cart.items[itemIndex].discount = product.discount || 0;
    } else {
      if (requestedQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${requestedQty}. Only ${product.stock} items available in stock`
        });
      }
      cart.items.push({
        productId: product._id,
        sellerId: product.sellerId,
        quantity: requestedQty,
        price: product.price,
        discount: product.discount || 0
      });
    }

    await cart.save();
    const formattedCart = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: formattedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private (Buyer)
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const newQty = parseInt(quantity, 10);
    if (isNaN(newQty) || newQty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(i => i._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    const product = await Product.findById(item.productId);
    if (!product || product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available'
      });
    }

    if (newQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock})`
      });
    }

    item.quantity = newQty;
    await cart.save();

    const formattedCart = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: formattedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private (Buyer)
export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    const formattedCart = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: formattedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private (Buyer)
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: {
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        total: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};
