import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      simulatedPaymentOutcome = 'SUCCESS'
    } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided for the order'
      });
    }

    if (!['COD', 'DEMO_ONLINE'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Choose COD or DEMO_ONLINE'
      });
    }

    // Handle simulated payment failure test
    if (paymentMethod === 'DEMO_ONLINE' && simulatedPaymentOutcome === 'FAILURE') {
      return res.status(400).json({
        success: false,
        message: 'DEMO Online Payment Simulation: Transaction was declined by the bank. Please try again.'
      });
    }

    // Validate each item and check live stock
    const orderItems = [];
    let subtotal = 0;
    let totalDiscount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name || 'Unknown'}" is no longer available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      const originalPrice = product.price;
      const discountPercent = product.discount || 0;
      const effectivePrice = discountPercent > 0 
        ? Math.round((originalPrice - (originalPrice * (discountPercent / 100))) * 100) / 100 
        : originalPrice;

      subtotal += originalPrice * item.quantity;
      totalDiscount += (originalPrice - effectivePrice) * item.quantity;

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        price: originalPrice,
        discount: discountPercent,
        sellingPrice: effectivePrice,
        quantity: item.quantity,
        itemStatus: 'Confirmed'
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;
    totalDiscount = Math.round(totalDiscount * 100) / 100;
    const totalAfterDiscount = subtotal - totalDiscount;
    const deliveryFee = totalAfterDiscount > 499 ? 0 : 40;
    const grandTotal = Math.round((totalAfterDiscount + deliveryFee) * 100) / 100;

    const paymentStatus = paymentMethod === 'DEMO_ONLINE' ? 'Paid' : 'Pending';
    const transactionId = paymentMethod === 'DEMO_ONLINE' 
      ? `TXN-DEMO-${Date.now()}-${Math.floor(Math.random() * 10000)}` 
      : `COD-${Date.now()}`;

    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount: totalDiscount,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Confirmed',
      paymentDetails: {
        transactionId,
        simulatedResult: 'SUCCESS',
        paidAt: paymentStatus === 'Paid' ? new Date() : null,
        paymentGateway: paymentMethod === 'DEMO_ONLINE' ? 'DEMO Instant Pay' : 'Cash on Delivery'
      }
    });

    // Deduct stock for all ordered products
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear buyer's cart after successful order creation
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('items.sellerId', 'name storeInfo email phone');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in buyer's orders
// @route   GET /api/orders
// @access  Private (Buyer)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('items.sellerId', 'name storeInfo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private (Buyer or Involved Seller)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name email phone')
      .populate('items.sellerId', 'name storeInfo email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Authorization check: buyer who placed it OR seller whose product is in the order
    const isBuyer = order.buyerId._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => 
      item.sellerId && item.sellerId._id.toString() === req.user._id.toString()
    );

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    // If seller is viewing, format items to only show seller's items
    if (req.user.role === 'seller' && !isBuyer) {
      const sellerItems = order.items.filter(item => 
        item.sellerId && item.sellerId._id.toString() === req.user._id.toString()
      );
      
      const sellerSubtotal = sellerItems.reduce((acc, i) => acc + (i.sellingPrice * i.quantity), 0);

      return res.status(200).json({
        success: true,
        order: {
          ...order.toObject(),
          items: sellerItems,
          sellerSubtotal: Math.round(sellerSubtotal * 100) / 100
        }
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Buyer)
// @route   PUT /api/orders/:id/cancel
// @access  Private (Buyer)
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyerId: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already '${order.orderStatus}'`
      });
    }

    order.orderStatus = 'Cancelled';
    order.items.forEach(item => item.itemStatus = 'Cancelled');
    await order.save();

    // Restore stock back to products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored',
      order
    });
  } catch (error) {
    next(error);
  }
};
