# DEMO — Full-Stack Multi-Vendor E-Commerce Marketplace

**DEMO** is a portfolio-quality, production-ready multi-vendor e-commerce marketplace web application inspired by the robust operational mechanics of modern platforms (Amazon/Flipkart), built with an original modern visual identity, real MongoDB database, JWT role-based authentication, isolated merchant dashboards, multi-vendor cart & order aggregation, verified purchaser product reviews, and an interactive simulated checkout sandbox.

---

## 🌟 Key Highlights & Architectural Features

### 🛒 1. Dual-Role Experience (Buyer & Seller)
- **Role Enforcement**: `buyer` and `seller` roles are validated at the database model level and enforced via backend authorization middlewares.
- **Dedicated Seller Portal**: Sellers have a separate merchant workspace (`/seller`) for analytics, catalog CRUD, order fulfillment, and inventory adjustments.
- **Buyer Experience**: High-conversion shopping storefront with search, category filtering, live wishlist, cart aggregation, saved addresses, order tracking timeline, and product reviews.

### 🏢 2. True Multi-Vendor Isolation
- **Multi-Merchant Cart**: Buyers can add products from multiple independent sellers into a single shopping cart and place a unified order.
- **Order Item Breakdown**: Every purchased item retains its `sellerId`, price at purchase time, quantity, and individual fulfillment status.
- **Data Privacy**: Seller A can **only** view and modify order items and catalog products belonging to Seller A. Accessing or updating another seller's data returns `403 Forbidden`.

### 💳 3. Safe Interactive Mock Payment Gateway
- Supports **Cash on Delivery (COD)** and **DEMO Instant Online Payment**.
- Interactive demo modal allows testing simulated Card, UPI, and NetBanking workflows with explicit **"Simulate Success"** and **"Simulate Failure"** actions for testing edge cases safely without external credentials.
- Stock automatically decrements upon successful checkout and is restored upon order cancellation.

### ⭐ 4. Verified Purchaser Reviews
- Only customers who have placed an order containing the product are permitted to publish a review.
- Dynamic recalculation of average ratings and review counts on the product document.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v7 |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`) |
| **Backend** | Node.js, Express.js (ESM modules), Multer |
| **Database** | MongoDB 8.0, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs (Salt rounds: 10), Role-based authorization |
| **Security** | Helmet HTTP headers, CORS whitelisting, Express Rate Limiting |
| **Testing** | Automated Backend Integration Test Suite |

---

## 📂 Project Structure

```
demo/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, SearchBar, Toast, Modal, Badges, StarRating, Skeletons
│   │   │   ├── buyer/          # ProductCard, ProductGrid, FilterSidebar, DemoPaymentModal, OrderTrackerTimeline
│   │   │   └── seller/         # SellerNavbar, SellerSidebar, StatCard, SalesMetricsChart, OrderStatusModal
│   │   ├── context/            # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── hooks/              # useAuth, useCart, useWishlist, useToast, useDebounce
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   ├── buyer/          # BuyerHomePage, ProductListingPage, ProductDetailPage, CartPage, CheckoutPage, BuyerOrdersPage, OrderDetailPage, WishlistPage, BuyerProfilePage, SellerStorePage
│   │   │   └── seller/         # SellerDashboardPage, SellerProductsPage, SellerProductFormPage, SellerOrdersPage, SellerInventoryPage, SellerStoreProfilePage, SellerSettingsPage
│   │   ├── routes/             # AppRoutes, ProtectedRoute, RoleRoute
│   │   ├── services/           # Axios API modules (api, authService, productService, cartService, orderService, sellerService, reviewService, wishlistService)
│   │   └── utils/              # formatters, constants
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (MongoDB Connection)
│   ├── controllers/            # authController, productController, cartController, orderController, sellerController, reviewController, wishlistController, categoryController
│   ├── middleware/             # auth.js, errorMiddleware.js, rateLimiter.js, upload.js
│   ├── models/                 # User, Product, Category, Cart, Order, Review, Wishlist
│   ├── routes/                 # Express REST API routes
│   ├── seed/                   # seed.js, seedData.js (Populates 5 sellers, 22+ products, categories, reviews)
│   ├── tests/                  # api.test.js (Automated integration test suite)
│   ├── server.js               # Application entrypoint
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher (Tested on Node v26)
- **MongoDB**: Local MongoDB instance running on `localhost:27017` or MongoDB Atlas URI

### 2. Configure Environment Variables
Create `.env` inside `server/`:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/demo_marketplace
JWT_SECRET=demo_jwt_secret_key_portfolio_2026
```

### 3. Seed Database with Realistic Demo Data
Run the seed script to populate categories, 5 verified sellers, 22+ rich products with specifications and Unsplash images, reviews, and test accounts:
```bash
cd server
npm run seed
```

### 4. Start the Application

#### Start Backend Server:
```bash
cd server
npm start
# Server starts on http://localhost:5001
```

#### Start Frontend Client (in a separate terminal):
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Name / Business | Email | Password |
| :--- | :--- | :--- | :--- |
| **Buyer** | Rahul Sharma | `buyer@demo.com` | `Password123!` |
| **Seller 1** | Apex Tech Store | `seller1@demo.com` | `Password123!` |
| **Seller 2** | Urban Vogue Studio | `seller2@demo.com` | `Password123!` |
| **Seller 3** | Aura Home & Living | `seller3@demo.com` | `Password123!` |
| **Seller 4** | PureGlow Organics | `seller4@demo.com` | `Password123!` |
| **Seller 5** | FreshMart Farm Direct | `seller5@demo.com` | `Password123!` |

*(Tip: You can also use the 1-click demo autofill buttons on the login page!)*

---

## 🧪 Automated Testing

Execute the complete backend integration test suite verifying authentication, role boundaries, multi-vendor cart isolation, stock deduction, and verified reviews:

```bash
cd server
npm test
```

### Integration Test Results:
```
  ✅ PASS: Server health check endpoint responds 200 OK
  ✅ PASS: Buyer login succeeds with JWT and buyer role
  ✅ PASS: Seller 1 login succeeds with JWT and seller role
  ✅ PASS: Invalid password correctly rejected with 401 Unauthorized
  ✅ PASS: Buyer attempting seller dashboard is rejected with 403 Forbidden
  ✅ PASS: Seller attempting buyer cart is rejected with 403 Forbidden
  ✅ PASS: Public products list with category filter returns matching products
  ✅ PASS: Search query for "Headphones" finds matching products
  ✅ PASS: Seller 1 can create a new product
  ✅ PASS: Seller 2 cannot edit Seller 1's product (403 Forbidden)
  ✅ PASS: Seller 1 can update own product
  ✅ PASS: Buyer can add Product A from Seller 1 to cart
  ✅ PASS: Buyer cart supports multi-vendor products from different sellers
  ✅ PASS: Adding quantity exceeding available stock is rejected with 400
  ✅ PASS: Buyer successfully places multi-vendor order with DEMO Online Payment
  ✅ PASS: Product A stock properly decremented by 2
  ✅ PASS: Product B stock properly decremented by 1
  ✅ PASS: Buyer cart is cleared automatically after placing order
  ✅ PASS: Seller 1 orders API ONLY exposes order items belonging to Seller 1
  ✅ PASS: Seller 2 orders API ONLY exposes order items belonging to Seller 2
  ✅ PASS: Seller 1 can update the status of their order item to Delivered
  ✅ PASS: Verified buyer can submit a review on purchased product
```

---

## 📡 REST API Overview

### Authentication & Profile (`/api/auth`)
- `POST /api/auth/register`: Register buyer or seller
- `POST /api/auth/login`: Authenticate and receive JWT token
- `GET /api/auth/me`: Get current user profile and role
- `PUT /api/auth/profile`: Update profile information & store info
- `POST /api/auth/addresses`: Add delivery address (Buyer)
- `DELETE /api/auth/addresses/:id`: Delete delivery address
- `PUT /api/auth/addresses/:id/default`: Set default address

### Products & Reviews (`/api/products`)
- `GET /api/products`: Search, filter by category/brand/price/rating, sort & paginate
- `GET /api/products/:id`: Product details & related recommendations
- `GET /api/products/highlights`: Featured deals, top discounts & trending items
- `GET /api/products/seller/:sellerId`: Public storefront products
- `POST /api/products`: Create product (Seller only)
- `PUT /api/products/:id`: Update owned product (Seller only)
- `DELETE /api/products/:id`: Delete owned product (Seller only)
- `GET /api/products/:id/reviews`: Get product reviews & score distribution
- `POST /api/products/:id/reviews`: Submit review (Verified purchasers only)

### Shopping Cart (`/api/cart`)
- `GET /api/cart`: Get current user's cart
- `POST /api/cart`: Add product with stock validation
- `PUT /api/cart/:itemId`: Update quantity
- `DELETE /api/cart/:itemId`: Remove item
- `DELETE /api/cart`: Clear cart

### Orders & Checkout (`/api/orders`)
- `POST /api/orders`: Place order (decrements inventory, resets cart)
- `GET /api/orders`: Buyer order history
- `GET /api/orders/:id`: Order details with status tracking
- `PUT /api/orders/:id/cancel`: Cancel order and restore stock

### Seller Operations (`/api/seller`)
- `GET /api/seller/dashboard`: Analytics (Revenue, orders, low stock count, sales chart)
- `GET /api/seller/products`: Seller's product catalog
- `GET /api/seller/orders`: Isolated order items belonging only to the authenticated seller
- `PUT /api/seller/orders/:orderId/status`: Update order fulfillment status
- `PUT /api/seller/inventory/:productId`: Inline quick stock adjustment

---

## 🛡️ Security & Quality Standards
- **Passwords**: Hashed with `bcryptjs` salt before saving to MongoDB.
- **Authorization**: Granular middleware checks role permissions and resource ownership.
- **Stock Integrity**: Real-time stock validation prevents placing orders exceeding inventory.
- **Sanitized Errors**: Safe global error handler masks internal stack traces in production.

---

## 📜 License
This project is open-source and built for portfolio and demonstration purposes.
# demo-website
