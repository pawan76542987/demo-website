import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Store,
  Menu,
  X,
  ChevronDown,
  Package,
  MapPin,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Layers
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { SearchBar } from './SearchBar';
import { CATEGORIES_LIST } from '../../utils/constants';

export const Navbar = () => {
  const { user, isAuthenticated, isBuyer, isSeller, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-subtle">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-brand-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-brand-700/60 px-2 py-0.5 rounded-full font-medium text-[11px] text-brand-200">
              <Sparkles className="w-3 h-3 text-accent-400" />
              DEMO Marketplace
            </span>
            <span className="hidden sm:inline text-slate-300">
              India's Premier Multi-Vendor Platform • Free Delivery on orders over ₹499
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            {!isAuthenticated ? (
              <>
                <Link to="/login?role=seller" className="hover:text-white transition flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-accent-400" />
                  <span>Sell on DEMO</span>
                </Link>
                <span className="text-brand-700">|</span>
                <Link to="/login" className="hover:text-white transition">
                  Help & Support
                </Link>
              </>
            ) : isSeller ? (
              <Link to="/seller" className="hover:text-white transition flex items-center gap-1 font-semibold text-accent-400">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Seller Center Active</span>
              </Link>
            ) : (
              <Link to="/login?role=seller" className="hover:text-white transition flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-accent-400" />
                <span>Become a Seller</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition">
                  DEMO
                </span>
                <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest -mt-1">
                  Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-4 max-w-2xl">
            <SearchBar />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* If Seller is logged in, show quick dashboard link */}
            {isSeller ? (
              <Link
                to="/seller"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Seller Portal</span>
              </Link>
            ) : (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="relative p-2.5 rounded-2xl text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white font-bold text-[11px] rounded-full flex items-center justify-center shadow-sm">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 px-3 py-2 rounded-2xl text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition"
                  title="Shopping Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-600 text-white font-bold text-[11px] rounded-full flex items-center justify-center shadow-sm">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline font-bold text-sm">Cart</span>
                </Link>
              </>
            )}

            {/* User Account / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevation border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isBuyer ? (
                      <>
                        <Link
                          to="/buyer/orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition"
                        >
                          <Heart className="w-4 h-4 text-slate-400" />
                          My Wishlist
                        </Link>
                        <Link
                          to="/buyer/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Saved Addresses & Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/seller"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/products"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          My Products
                        </Link>
                        <Link
                          to="/seller/orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          Customer Orders
                        </Link>
                        <Link
                          to="/seller/store"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition"
                        >
                          <Store className="w-4 h-4 text-slate-400" />
                          Store Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-700 hover:text-brand-600 font-semibold text-sm transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Category Pills Subnavigation */}
      <div className="border-t border-slate-100 bg-white/70 backdrop-blur-sm hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar text-xs font-medium text-slate-600">
            <Link
              to="/products"
              className="font-bold text-brand-600 hover:text-brand-700 shrink-0 flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              All Products
            </Link>
            {CATEGORIES_LIST.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="hover:text-brand-600 transition shrink-0 whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[115px] bg-white border-b border-slate-200 shadow-xl p-4 z-50 animate-in slide-in-from-top-4">
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Explore Categories</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-brand-50 text-brand-700 font-semibold text-xs"
              >
                All Products
              </Link>
              {CATEGORIES_LIST.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium text-xs hover:bg-brand-50 hover:text-brand-600"
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm"
                  >
                    Buyer Sign In
                  </Link>
                  <Link
                    to="/login?role=seller"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm"
                  >
                    Seller Portal Login
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left py-2 text-rose-600 font-medium text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out ({user.name})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
