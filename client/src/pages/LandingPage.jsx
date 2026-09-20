import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Users
} from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/buyer/ProductCard';
import { CategoryCard } from '../components/buyer/CategoryCard';
import { CATEGORIES_LIST } from '../utils/constants';

export const LandingPage = () => {
  const [highlights, setHighlights] = useState({
    featured: [],
    topDeals: [],
    topRated: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [highRes, catRes] = await Promise.all([
          productService.getHighlights(),
          productService.getCategories()
        ]);
        if (highRes.success) setHighlights(highRes);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-brand-950 to-slate-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-brand-200 mb-8 shadow-inner animate-in fade-in slide-in-from-top-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>Next-Generation Multi-Vendor Marketplace</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            One Marketplace. <br />
            <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-accent-300 bg-clip-text text-transparent">
              Thousands of Products.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Discover verified independent Indian sellers, electronics, luxury fashion, home appliances, and organic staples at unmatched prices.
          </p>

          {/* DUAL CHOICE GATEWAY BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-base shadow-glow hover:shadow-elevation transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <ShoppingBag className="w-5 h-5 text-brand-200" />
              <span>Shop as Buyer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/register?role=seller"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-base border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5 text-accent-400" />
              <span>Sell on DEMO</span>
            </Link>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <span className="font-semibold text-accent-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Quick Demo Access:
            </span>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/login?demo=buyer"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
              >
                Demo Buyer Login
              </Link>
              <Link
                to="/login?demo=seller1"
                className="px-3 py-1.5 rounded-xl bg-brand-600/60 hover:bg-brand-600 text-white font-medium transition"
              >
                Demo Seller 1 (Apex Tech)
              </Link>
              <Link
                to="/login?demo=seller2"
                className="px-3 py-1.5 rounded-xl bg-purple-600/60 hover:bg-purple-600 text-white font-medium transition"
              >
                Demo Seller 2 (Fashion)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES_LIST.map((catName) => (
            <Link
              key={catName}
              to={`/products?category=${encodeURIComponent(catName)}`}
              className="bg-white hover:bg-brand-50 rounded-2xl p-4 border border-slate-200/80 hover:border-brand-300 shadow-card hover:shadow-elevation transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition shadow-sm font-bold text-sm">
                {catName.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-brand-700 transition line-clamp-1">
                {catName}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-extrabold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              Limited Time Deals
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Top Marketplace Discounts
            </h2>
          </div>
          <Link
            to="/products?sort=discount"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {highlights.topDeals.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Verified Independent Sellers Spotlight */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-accent-400 font-bold text-xs uppercase tracking-wider">
              Multi-Vendor Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Verified Independent Sellers
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Every seller on DEMO is thoroughly vetted to guarantee authentic products, warranty fulfillment, and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                    A
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Apex Tech Solutions</h3>
                    <p className="text-xs text-slate-400">Electronics & Premium Audio</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authorized retailer of next-gen laptops, ANC wireless headphones, smartwatches, and gaming peripherals.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">★ 4.9 Rating (1,400+ reviews)</span>
                <Link to="/products?category=Electronics" className="text-brand-400 hover:text-brand-300 font-semibold">
                  View Catalog →
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                    U
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Urban Vogue Studio</h3>
                    <p className="text-xs text-slate-400">Contemporary Fashion & Footwear</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Handcrafted French linen shirts, carbon running sneakers, leather bags, and designer sunglasses.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">★ 4.7 Rating (980+ reviews)</span>
                <Link to="/products?category=Fashion" className="text-brand-400 hover:text-brand-300 font-semibold">
                  View Catalog →
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    P
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">PureGlow Botanicals</h3>
                    <p className="text-xs text-slate-400">Clean Skincare & Wellness</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cruelty-free, dermatologically tested Vitamin C serums, SPF 50 sunscreens, and Rosemary hair oils.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">★ 4.9 Rating (840+ reviews)</span>
                <Link to="/products?category=Beauty" className="text-brand-400 hover:text-brand-300 font-semibold">
                  View Catalog →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-brand-600 font-bold text-xs uppercase tracking-wider">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Trending on DEMO
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Explore All 20+ Items
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {highlights.featured.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Seller Onboarding Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
              <Store className="w-3.5 h-3.5 text-accent-300" />
              Grow Your Business
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Start Selling to Millions on DEMO Today
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed">
              Join India's fastest-growing multi-vendor marketplace with 0% onboarding fee, automated shipping management, and weekly payout settlements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            <Link
              to="/register?role=seller"
              className="px-8 py-4 rounded-2xl bg-white text-brand-900 hover:bg-brand-50 font-extrabold text-sm transition shadow-lg text-center"
            >
              Register as Seller
            </Link>
            <Link
              to="/login?role=seller"
              className="px-8 py-4 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-extrabold text-sm border border-white/20 backdrop-blur-md transition text-center"
            >
              Seller Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
