import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { BuyerLayout } from '../components/layout/BuyerLayout';
import { SellerLayout } from '../components/layout/SellerLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Buyer Pages
import { ProductListingPage } from '../pages/buyer/ProductListingPage';
import { ProductDetailPage } from '../pages/buyer/ProductDetailPage';
import { CartPage } from '../pages/buyer/CartPage';
import { CheckoutPage } from '../pages/buyer/CheckoutPage';
import { BuyerOrdersPage } from '../pages/buyer/BuyerOrdersPage';
import { OrderDetailPage } from '../pages/buyer/OrderDetailPage';
import { WishlistPage } from '../pages/buyer/WishlistPage';
import { BuyerProfilePage } from '../pages/buyer/BuyerProfilePage';
import { SellerStorePage } from '../pages/buyer/SellerStorePage';

// Seller Pages
import { SellerDashboardPage } from '../pages/seller/SellerDashboardPage';
import { SellerProductsPage } from '../pages/seller/SellerProductsPage';
import { SellerProductFormPage } from '../pages/seller/SellerProductFormPage';
import { SellerOrdersPage } from '../pages/seller/SellerOrdersPage';
import { SellerInventoryPage } from '../pages/seller/SellerInventoryPage';
import { SellerStoreProfilePage } from '../pages/seller/SellerStoreProfilePage';
import { SellerSettingsPage } from '../pages/seller/SellerSettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Buyer & Public Marketplace Routes */}
      <Route element={<BuyerLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/store/:sellerId" element={<SellerStorePage />} />

        {/* Protected Buyer Routes */}
        <Route
          path="/cart"
          element={
            <RoleRoute allowedRole="buyer">
              <CartPage />
            </RoleRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <RoleRoute allowedRole="buyer">
              <CheckoutPage />
            </RoleRoute>
          }
        />
        <Route
          path="/buyer/orders"
          element={
            <RoleRoute allowedRole="buyer">
              <BuyerOrdersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/buyer/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <RoleRoute allowedRole="buyer">
              <WishlistPage />
            </RoleRoute>
          }
        />
        <Route
          path="/buyer/profile"
          element={
            <RoleRoute allowedRole="buyer">
              <BuyerProfilePage />
            </RoleRoute>
          }
        />
      </Route>

      {/* Seller Portal Protected Routes */}
      <Route
        path="/seller"
        element={
          <RoleRoute allowedRole="seller">
            <SellerLayout />
          </RoleRoute>
        }
      >
        <Route index element={<SellerDashboardPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="products/new" element={<SellerProductFormPage />} />
        <Route path="products/:id/edit" element={<SellerProductFormPage />} />
        <Route path="orders" element={<SellerOrdersPage />} />
        <Route path="inventory" element={<SellerInventoryPage />} />
        <Route path="store" element={<SellerStoreProfilePage />} />
        <Route path="settings" element={<SellerSettingsPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
