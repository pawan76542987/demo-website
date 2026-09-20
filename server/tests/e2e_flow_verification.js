const BASE_URL = 'http://localhost:5001';

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
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

const runE2EValidation = async () => {
  console.log('====================================================');
  console.log('🌟 EXHAUSTIVE E2E FLOW & ROLE AUTHORIZATION TEST');
  console.log('====================================================\n');

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
    // ----------------------------------------------------
    // FLOW 1: BUYER ONBOARDING & SHOPPING
    // ----------------------------------------------------
    console.log('🛒 [FLOW 1] Buyer Registration, Catalog Browsing & Cart');

    const buyerEmail = `buyer_${Date.now()}@demo.com`;
    const buyerRegRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Ananya Iyer',
        email: buyerEmail,
        phone: '+91 99887 76655',
        password: 'Password123!',
        role: 'buyer',
        address: {
          fullName: 'Ananya Iyer',
          phone: '+91 99887 76655',
          street: 'Tower 3, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038'
        }
      }
    });
    assert(buyerRegRes.status === 201 && buyerRegRes.body.token, 'Buyer registration succeeds with token');
    const buyerToken = buyerRegRes.body.token;

    // Fetch Catalog & Search
    // Find products specifically from Seller 1 (Apex Tech) and Seller 2 (Urban Vogue)
    const allProdsRes = await request('/api/products?limit=50');
    const targetProduct = allProdsRes.body.products.find(p => p.sellerId?.email === 'seller1@demo.com') || allProdsRes.body.products[0];
    const initialStock = targetProduct.stock;

    // Add to Cart
    const addCartRes = await request('/api/cart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { productId: targetProduct._id, quantity: 1 }
    });
    assert(addCartRes.status === 200 && addCartRes.body.cart.items.length === 1, 'Product added to Buyer Cart');

    // Toggle Wishlist
    const addWishRes = await request('/api/wishlist', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { productId: targetProduct._id }
    });
    assert(addWishRes.status === 200, 'Product saved to Buyer Wishlist');

    // ----------------------------------------------------
    // FLOW 2: MULTI-VENDOR CART & CHECKOUT WITH SIMULATED PAYMENT
    // ----------------------------------------------------
    console.log('\n💳 [FLOW 2] Multi-Vendor Cart & Safe Mock Online Payment');

    // Find a product from Seller 2 (Urban Vogue)
    const secondProduct = allProdsRes.body.products.find(p => p.sellerId?.email === 'seller2@demo.com');
    const initialStock2 = secondProduct.stock;

    // Add second product to cart
    await request('/api/cart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { productId: secondProduct._id, quantity: 2 }
    });

    const getCartRes = await request('/api/cart', {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    assert(getCartRes.body.cart.items.length === 2, 'Multi-vendor cart holds products from multiple sellers');

    // Place Order via DEMO_ONLINE payment
    const orderRes = await request('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: {
        items: [
          { productId: targetProduct._id, quantity: 1 },
          { productId: secondProduct._id, quantity: 2 }
        ],
        shippingAddress: {
          fullName: 'Ananya Iyer',
          phone: '+91 99887 76655',
          street: 'Tower 3, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India'
        },
        paymentMethod: 'DEMO_ONLINE',
        simulatedPaymentOutcome: 'SUCCESS'
      }
    });
    assert(orderRes.status === 201 && orderRes.body.order.paymentStatus === 'Paid', 'Order successfully placed with DEMO Instant Pay');
    const orderId = orderRes.body.order._id;

    // Verify stock decreased in DB
    const p1After = (await request(`/api/products/${targetProduct._id}`)).body.product;
    const p2After = (await request(`/api/products/${secondProduct._id}`)).body.product;
    assert(p1After.stock === initialStock - 1, `Product 1 stock decremented by 1 (${initialStock} -> ${p1After.stock})`);
    assert(p2After.stock === initialStock2 - 2, `Product 2 stock decremented by 2 (${initialStock2} -> ${p2After.stock})`);

    // ----------------------------------------------------
    // FLOW 3: VERIFIED PURCHASER REVIEW
    // ----------------------------------------------------
    console.log('\n⭐ [FLOW 3] Verified Purchaser Product Review');

    const reviewRes = await request(`/api/products/${targetProduct._id}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: {
        rating: 5,
        title: 'Outstanding build quality & audio clarity',
        comment: 'Super fast delivery and flawless active noise cancellation on DEMO!'
      }
    });
    assert(reviewRes.status === 201 && reviewRes.body.review.isVerifiedPurchase, 'Verified purchaser successfully submitted review');

    // Non-purchaser attempting review on a product they NEVER bought (must fail)
    const unpurchasedProduct = allProdsRes.body.products.find(
      p => p._id !== targetProduct._id && p._id !== secondProduct._id
    );
    const fraudReviewRes = await request(`/api/products/${unpurchasedProduct._id}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { rating: 1, comment: 'Fake review attempt' }
    });
    assert(fraudReviewRes.status === 403, 'Non-purchaser review attempt is rejected with 403 Forbidden');

    // ----------------------------------------------------
    // FLOW 4: SELLER ISOLATION & ORDER FULFILLMENT
    // ----------------------------------------------------
    console.log('\n🏢 [FLOW 4] Seller Multi-Vendor Isolation & Order Status Updating');

    // Login as Seller 1 (Apex Tech)
    const s1Login = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'seller1@demo.com', password: 'Password123!' }
    });
    const s1Token = s1Login.body.token;

    // Login as Seller 2 (Urban Vogue)
    const s2Login = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'seller2@demo.com', password: 'Password123!' }
    });
    const s2Token = s2Login.body.token;

    // Seller 1 fetches orders -> must contain our multi-vendor order, but ONLY Seller 1's items!
    const s1Orders = (await request('/api/seller/orders', {
      headers: { Authorization: `Bearer ${s1Token}` }
    })).body.orders;
    const orderInS1 = s1Orders.find(o => o._id === orderId);
    assert(
      orderInS1 && orderInS1.items.every(i => i.sellerId.toString() === s1Login.body.user._id),
      'Seller 1 orders API ONLY presents order items belonging to Seller 1'
    );

    // Seller 2 fetches orders -> must contain our multi-vendor order, but ONLY Seller 2's items!
    const s2Orders = (await request('/api/seller/orders', {
      headers: { Authorization: `Bearer ${s2Token}` }
    })).body.orders;
    const orderInS2 = s2Orders.find(o => o._id === orderId);
    assert(
      orderInS2 && orderInS2.items.every(i => i.sellerId.toString() === s2Login.body.user._id),
      'Seller 2 orders API ONLY presents order items belonging to Seller 2'
    );

    // Seller 1 updates item fulfillment status to 'Delivered'
    const updateFulfillment = await request(`/api/seller/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${s1Token}` },
      body: { status: 'Delivered' }
    });
    assert(updateFulfillment.status === 200, 'Seller 1 can update fulfillment status');

    // ----------------------------------------------------
    // FLOW 5: SELLER PRODUCT CRUD & DATA MODIFICATION BOUNDARIES
    // ----------------------------------------------------
    console.log('\n🔒 [FLOW 5] Seller Product Management & Ownership Protection');

    // Seller 1 creates new product
    const newProdRes = await request('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${s1Token}` },
      body: {
        name: 'Pro Gamer RGB Desk Pad XXL',
        description: 'Extra thick 4mm micro-textured cloth with 360-degree dynamic RGB lighting.',
        category: 'Electronics',
        brand: 'Apex Tech',
        price: 1499,
        discount: 20,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800']
      }
    });
    assert(newProdRes.status === 201 && newProdRes.body.product._id, 'Seller 1 creates product in marketplace');
    const testProdId = newProdRes.body.product._id;

    // Seller 2 attempts to delete or modify Seller 1's product (Must fail with 403)
    const unauthorizedEdit = await request(`/api/products/${testProdId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${s2Token}` },
      body: { price: 10 }
    });
    assert(unauthorizedEdit.status === 403, 'Seller 2 cannot modify Seller 1\'s product (403 Forbidden)');

    const unauthorizedDelete = await request(`/api/products/${testProdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${s2Token}` }
    });
    assert(unauthorizedDelete.status === 403, 'Seller 2 cannot delete Seller 1\'s product (403 Forbidden)');

    // Seller 1 modifies own stock via quick inventory adjuster
    const invRes = await request(`/api/seller/inventory/${testProdId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${s1Token}` },
      body: { stock: 45 }
    });
    assert(invRes.status === 200 && invRes.body.product.stock === 45, 'Seller 1 updates inventory stock to 45');

    // Cleanup test product
    await request(`/api/products/${testProdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${s1Token}` }
    });

    // ----------------------------------------------------
    // FLOW 6: EDGE CASES & ERROR HANDLING
    // ----------------------------------------------------
    console.log('\n🛡️ [FLOW 6] Edge Cases, Out-of-Stock & Simulated Payment Decline');

    // Test Simulated Online Payment Failure
    const failedPaymentRes = await request('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: {
        items: [{ productId: targetProduct._id, quantity: 1 }],
        shippingAddress: { fullName: 'Test', street: 'MG Road', city: 'BLR', postalCode: '560001' },
        paymentMethod: 'DEMO_ONLINE',
        simulatedPaymentOutcome: 'FAILURE'
      }
    });
    assert(
      failedPaymentRes.status === 400 && failedPaymentRes.body.message.includes('Simulation: Transaction was declined'),
      'Simulated payment failure is handled with explicit descriptive user message and no order is placed'
    );

    // Test Excess quantity greater than stock
    const excessCartRes = await request('/api/cart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: { productId: targetProduct._id, quantity: 999999 }
    });
    assert(excessCartRes.status === 400, 'Adding quantity exceeding available stock is rejected with 400 Bad Request');

  } catch (err) {
    console.error('Validation error:', err);
    failed++;
  } finally {
    console.log('\n====================================================');
    console.log(`🎉 E2E VALIDATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
};

runE2EValidation();
