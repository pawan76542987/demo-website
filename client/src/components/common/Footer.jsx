import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import { CATEGORIES_LIST } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0 border border-brand-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Lightning Fast Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Free standard shipping on all qualifying orders across India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Genuine Products</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Verified independent sellers offering authentic products and brand warranties.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-accent-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                7-day easy replacement or instant return policy on eligible orders.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Live customer support and seller onboarding assistance around the clock.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                D
              </div>
              <span className="text-2xl font-black tracking-tight text-white">DEMO</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              DEMO is a next-generation multi-vendor e-commerce marketplace empowering direct trade between verified independent merchants and savvy shoppers.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">DEMO Headquarters:</span> Outer Ring Road, Tech Corridor, Bengaluru, Karnataka 560103
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {CATEGORIES_LIST.slice(0, 6).map((category) => (
                <li key={category}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="hover:text-brand-400 transition"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Buyer Center</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/buyer/orders" className="hover:text-brand-400 transition">
                  Track Your Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-400 transition">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-400 transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/buyer/profile" className="hover:text-brand-400 transition">
                  Shipping Addresses
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-400 transition">
                  Explore Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Seller Center */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Sell on DEMO</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/register?role=seller" className="hover:text-brand-400 transition font-medium text-accent-400">
                  Register as Merchant
                </Link>
              </li>
              <li>
                <Link to="/login?role=seller" className="hover:text-brand-400 transition">
                  Seller Portal Login
                </Link>
              </li>
              <li>
                <Link to="/seller" className="hover:text-brand-400 transition">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/products/new" className="hover:text-brand-400 transition">
                  List New Product
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} DEMO Marketplace Inc. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for high-conversion commerce</span>
        </div>
      </div>
    </footer>
  );
};
