import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import mongoose from 'mongoose';

// @desc    Get Seller Dashboard statistics & analytics
// @route   GET /api/seller/dashboard
// @access  Private (Seller only)
export const getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    // 1. Total products & low stock items count
    const totalProducts = await Product.countDocuments({ sellerId });
    const lowStockProducts = await Product.countDocuments({ sellerId, stock: { $lt: 10 } });
    const outOfStockProducts = await Product.countDocuments({ sellerId, stock: 0 });

    // 2. Query all orders that include products belonging to this seller
    const orders = await Order.find({ 'items.sellerId': sellerId })
      .populate('buyerId', 'name email phone')
      .sort({ createdAt: -1 });

    let totalSales = 0;
    let pendingOrdersCount = 0;
    let completedOrdersCount = 0;
    const recentOrders = [];

    // Monthly revenue aggregation
    const monthlySalesMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthlySalesMap[label] = { month: label, revenue: 0, orders: 0 };
    }

    orders.forEach(order => {
      // Filter out items not belonging to this seller
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      const sellerOrderRevenue = sellerItems.reduce((sum, item) => {
        return sum + (item.sellingPrice * item.quantity);
      }, 0);

      // Check item statuses for this seller
      const hasPending = sellerItems.some(i => ['Pending', 'Confirmed', 'Processing'].includes(i.itemStatus));
      const allDelivered = sellerItems.every(i => i.itemStatus === 'Delivered');

      if (order.orderStatus !== 'Cancelled') {
        totalSales += sellerOrderRevenue;
        
        // Month key
        const orderDate = new Date(order.createdAt);
        const monthKey = `${months[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
        if (monthlySalesMap[monthKey]) {
          monthlySalesMap[monthKey].revenue += sellerOrderRevenue;
          monthlySalesMap[monthKey].orders += 1;
        }
      }

      if (hasPending) pendingOrdersCount++;
      if (allDelivered) completedOrdersCount++;

      if (recentOrders.length < 5) {
        recentOrders.push({
          _id: order._id,
          buyer: order.buyerId ? { name: order.buyerId.name, email: order.buyerId.email } : { name: 'Customer' },
          shippingAddress: order.shippingAddress,
          items: sellerItems,
          sellerTotal: Math.round(sellerOrderRevenue * 100) / 100,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          overallStatus: order.orderStatus
        });
      }
    });

    const salesAnalytics = Object.values(monthlySalesMap);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders: orders.length,
        totalSales: Math.round(totalSales * 100) / 100,
        pendingOrders: pendingOrdersCount,
        completedOrders: completedOrdersCount,
        lowStockProducts,
        outOfStockProducts
      },
      salesAnalytics,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for current seller
// @route   GET /api/seller/products
// @access  Private (Seller only)
export const getSellerProducts = async (req, res, next) => {
  try {
    const { search, category, status, stockFilter, page = 1, limit = 20 } = req.query;
    const sellerId = req.user._id;

    const query = { sellerId };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { sku: searchRegex }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (stockFilter === 'low') {
      query.stock = { $gt: 0, $lt: 10 };
    } else if (stockFilter === 'out') {
      query.stock = 0;
    } else if (stockFilter === 'in') {
      query.stock = { $gte: 10 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders containing current seller's products (ISOLATED)
// @route   GET /api/seller/orders
// @access  Private (Seller only)
export const getSellerOrders = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const { status, search } = req.query;

    const query = { 'items.sellerId': sellerId };

    const rawOrders = await Order.find(query)
      .populate('buyerId', 'name email phone')
      .sort({ createdAt: -1 });

    // Filter and transform so seller only sees their own order items
    let sellerOrders = rawOrders.map(order => {
      const sellerItems = order.items.filter(item => 
        item.sellerId.toString() === sellerId.toString()
      );

      const sellerSubtotal = sellerItems.reduce(
        (sum, item) => sum + (item.sellingPrice * item.quantity), 
        0
      );

      return {
        _id: order._id,
        buyer: order.buyerId ? {
          _id: order.buyerId._id,
          name: order.buyerId.name,
          email: order.buyerId.email,
          phone: order.buyerId.phone
        } : { name: 'Customer' },
        shippingAddress: order.shippingAddress,
        items: sellerItems,
        sellerTotal: Math.round(sellerSubtotal * 100) / 100,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });

    if (status && status !== 'All') {
      sellerOrders = sellerOrders.filter(order => 
        order.items.some(item => item.itemStatus === status) || order.orderStatus === status
      );
    }

    if (search && search.trim() !== '') {
      const s = search.toLowerCase().trim();
      sellerOrders = sellerOrders.filter(order => 
        order._id.toString().includes(s) ||
        order.buyer.name?.toLowerCase().includes(s) ||
        order.buyer.email?.toLowerCase().includes(s) ||
        order.items.some(i => i.name.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: sellerOrders.length,
      orders: sellerOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order item status by seller
// @route   PUT /api/seller/orders/:orderId/status
// @access  Private (Seller only)
export const updateSellerOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { itemId, status } = req.body;
    const sellerId = req.user._id;

    const allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    let itemUpdated = false;

    // Update specific item if itemId provided, or all items belonging to this seller in this order
    order.items.forEach(item => {
      if (item.sellerId.toString() === sellerId.toString()) {
        if (!itemId || item._id.toString() === itemId.toString()) {
          item.itemStatus = status;
          itemUpdated = true;
        }
      }
    });

    if (!itemUpdated) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this order item, or item was not found.'
      });
    }

    // Determine aggregate order status
    const allItemsDelivered = order.items.every(item => item.itemStatus === 'Delivered');
    const allItemsCancelled = order.items.every(item => item.itemStatus === 'Cancelled');
    const anyItemShipped = order.items.some(item => ['Shipped', 'Out for Delivery', 'Delivered'].includes(item.itemStatus));

    if (allItemsDelivered) {
      order.orderStatus = 'Delivered';
    } else if (allItemsCancelled) {
      order.orderStatus = 'Cancelled';
    } else if (anyItemShipped) {
      order.orderStatus = 'Shipped';
    } else {
      order.orderStatus = status;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}' successfully`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick update product stock
// @route   PUT /api/seller/inventory/:productId
// @access  Private (Seller only)
export const updateQuickStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;
    const sellerId = req.user._id;

    if (stock === undefined || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity (>= 0) is required'
      });
    }

    const product = await Product.findOne({ _id: productId, sellerId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in your inventory'
      });
    }

    product.stock = Number(stock);
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};
