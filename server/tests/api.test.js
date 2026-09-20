import http from 'http';
import mongoose from 'mongoose';
import app from '../server.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';

let server;
let baseUrl;

const startServer = () => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
};

// Helper for HTTP requests
const request = async (endpoint, options = {}) => {
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  return {
    status: response.status,
    body: data
  };
};

const runTests = async () => {
  console.log('\n🚀 STARTING DEMO BACKEND INTEGRATION TEST SUITE...\n');
  await startServer();

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${details ? '- ' + details : ''}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await request('/api/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'online', 'Server health check endpoint responds 200 OK');

    // 2. Auth Tests - Login Buyer & Sellers
    const buyerLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'buyer@demo.com', password: 'Password123!' }
    });
    assert(buyerLoginRes.status === 200 && buyerLoginRes.body.token && buyerLoginRes.body.user.role === 'buyer', 'Buyer login succeeds with JWT and buyer role');
    const buyerToken = buyerLoginRes.body.token;

    const seller1LoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'seller1@demo.com', password: 'Password123!' }
    });
    assert(seller1LoginRes.status === 200 && seller1LoginRes.body.token && seller1LoginRes.body.user.role === 'seller', 'Seller 1 login succeeds with JWT and seller role');
    const seller1Token = seller1LoginRes.body.token;

    const seller2LoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'seller2@demo.com', password: 'Password123!' }
    });
    const seller2Token = seller2LoginRes.body.token;

    // 3. Invalid credentials test
    const invalidLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'buyer@demo.com', password: 'WrongPassword!' }
    });
    assert(invalidLoginRes.status === 401, 'Invalid password correctly rejected with 401 Unauthorized');

    // 4. Role-based Route Protection
    // Buyer attempting to access seller dashboard (Must fail with 403)
    const buyerOnSellerRes = await request('/api/seller/dashboard', {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    assert(buyerOnSellerRes.status === 403, 'Buyer attempting seller dashboard is rejected with 403 Forbidden');

    // Seller attempting to access buyer cart (Must fail with 403)
    const sellerOnCartRes = await request('/api/cart', {
      headers: { Authorization: `Bearer ${seller1Token}` }
    });
    assert(sellerOnCartRes.status === 403, 'Seller attempting buyer cart is rejected with 403 Forbidden');

    // 5. Product Catalog & Search/Filters
    const productsRes = await request('/api/products?category=Electronics');
    assert(productsRes.status === 200 && productsRes.body.products.length > 0, 'Public products list with category filter returns matching products');

    const searchRes = await request('/api/products?search=Headphones');
    assert(searchRes.status === 200 && searchRes.body.products.length > 0, 'Search query for "Headphones" finds matching products');

    // 6. Seller Product Creation & Multi-Vendor Ownership Protection
    const createProdRes = await request('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${seller1Token}` },
      body: {
        name: 'Test Mechanical Keyboard RGB',
        description: 'Hot-swappable mechanical keyboard for gaming and coding.',
        category: 'Electronics',
        brand: 'Apex Tech',
        price: 3999,
        discount: 10,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800']
      }
    });
    assert(createProdRes.status === 201 && createProdRes.body.product._id, 'Seller 1 can create a new product');
    const createdProductId = createProdRes.body.product._id;

    // Seller 2 attempts to edit Seller 1's newly created product (Must fail with 403)
    const hackProductRes = await request(`/api/products/${createdProductId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${seller2Token}` },
      body: { price: 100 }
    });
    assert(hackProductRes.status === 403, 'Seller 2 cannot edit Seller 1\'s product (403 Forbidden)');

    // Seller 1 updates own product
    const updateOwnProdRes = await request(`/api/products/${createdProductId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${seller1Token}` },
      body: { price: 3499 }
    });
    assert(updateOwnProdRes.status === 200 && updateOwnProdRes.body.product.price === 3499, 'Seller 1 can update own product');

    // 7. Cart & Stock Validations
    const allProducts = await Product.find({ status: 'active' });
    const productA = allProducts.find(p => p.sellerId.toString() === seller1LoginRes.body.user._id);
    const productB = allProducts.find(p => p.sellerId.toString() === seller2LoginRes.body.user._id);

    // Buyer clears cart first
    await request('/api/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${buyerToken}` }
    });

    // Add Product A to cart
    const addCartResA = await request('/api/cart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { productId: productA._id, quantity: 2 }
    });
    assert(addCartResA.status === 200 && addCartResA.body.cart.items.length === 1, 'Buyer can add Product A from Seller 1 to cart');

    // Add Product B to cart (multi-vendor cart)
    const addCartResB = await request('/api/cart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { productId: productB._id, quantity: 1 }
    });
    assert(addCartResB.status === 200 && addCartResB.body.cart.items.length === 2, 'Buyer cart supports multi-vendor products from different sellers');

    // Test requesting more quantity than stock
    const overStockRes = await request('/api/cart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { productId: productA._id, quantity: 99999 }
    });
    assert(overStockRes.status === 400, 'Adding quantity exceeding available stock is rejected with 400');

    // 8. Multi-Vendor Order Placement & Stock Decrement
    const initialStockA = productA.stock;
    const initialStockB = productB.stock;

    const placeOrderRes = await request('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: {
        items: [
          { productId: productA._id, quantity: 2 },
          { productId: productB._id, quantity: 1 }
        ],
        shippingAddress: {
          fullName: 'Rahul Sharma',
          phone: '+91 98765 43210',
          street: '123 Residency Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        paymentMethod: 'DEMO_ONLINE',
        simulatedPaymentOutcome: 'SUCCESS'
      }
    });
    assert(placeOrderRes.status === 201 && placeOrderRes.body.order.paymentStatus === 'Paid', 'Buyer successfully places multi-vendor order with DEMO Online Payment');
    const newOrderId = placeOrderRes.body.order._id;

    // Verify stock decremented in MongoDB
    const updatedProdA = await Product.findById(productA._id);
    const updatedProdB = await Product.findById(productB._id);
    assert(updatedProdA.stock === initialStockA - 2, `Product A stock properly decremented by 2 (${initialStockA} -> ${updatedProdA.stock})`);
    assert(updatedProdB.stock === initialStockB - 1, `Product B stock properly decremented by 1 (${initialStockB} -> ${updatedProdB.stock})`);

    // Verify cart was cleared after order
    const cartAfterOrder = await request('/api/cart', {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    assert(cartAfterOrder.body.cart.items.length === 0, 'Buyer cart is cleared automatically after placing order');

    // 9. Seller Isolation Verification
    // Seller 1 calls /api/seller/orders -> Must ONLY see items for Seller 1
    const seller1OrdersRes = await request('/api/seller/orders', {
      headers: { Authorization: `Bearer ${seller1Token}` }
    });
    const orderInSeller1 = seller1OrdersRes.body.orders.find(o => o._id === newOrderId);
    assert(
      orderInSeller1 && orderInSeller1.items.every(i => i.sellerId.toString() === seller1LoginRes.body.user._id),
      'Seller 1 orders API ONLY exposes order items belonging to Seller 1'
    );

    // Seller 2 calls /api/seller/orders -> Must ONLY see items for Seller 2
    const seller2OrdersRes = await request('/api/seller/orders', {
      headers: { Authorization: `Bearer ${seller2Token}` }
    });
    const orderInSeller2 = seller2OrdersRes.body.orders.find(o => o._id === newOrderId);
    assert(
      orderInSeller2 && orderInSeller2.items.every(i => i.sellerId.toString() === seller2LoginRes.body.user._id),
      'Seller 2 orders API ONLY exposes order items belonging to Seller 2'
    );

    // 10. Seller Updates Order Item Status
    const updateStatusRes = await request(`/api/seller/orders/${newOrderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${seller1Token}` },
      body: { status: 'Delivered' }
    });
    assert(updateStatusRes.status === 200, 'Seller 1 can update the status of their order item to Delivered');

    // 11. Product Review (Verified Purchaser)
    const reviewRes = await request(`/api/products/${productA._id}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: {
        rating: 5,
        title: 'Awesome purchase!',
        comment: 'Super fast delivery and top notch quality!'
      }
    });
    assert(reviewRes.status === 201 && reviewRes.body.review.rating === 5, 'Verified buyer can submit a review on purchased product');

    // Clean up test product
    await request(`/api/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${seller1Token}` }
    });

  } catch (err) {
    console.error('Test Suite Error:', err);
    failed++;
  } finally {
    await stopServer();
    console.log('\n====================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
};

runTests();
