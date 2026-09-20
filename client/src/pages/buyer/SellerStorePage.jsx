import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductGrid } from '../../components/buyer/ProductGrid';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StarRating } from '../../components/common/StarRating';
import { Store, ShieldCheck, Mail, Phone, MapPin, Package } from 'lucide-react';

export const SellerStorePage = () => {
  const { sellerId } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await productService.getSellerStore(sellerId);
        if (res.success) {
          setStoreData(res);
        }
      } catch (err) {
        console.error('Failed to load seller store:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" text="Loading merchant storefront..." />
      </div>
    );
  }

  if (!storeData || !storeData.seller) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Store Not Found</h2>
        <Link to="/products" className="text-brand-600 font-bold text-xs mt-4">
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  const { seller, products, productCount } = storeData;
  const storeInfo = seller.storeInfo || {};

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Store Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white mb-8 border border-slate-800 shadow-card">
        {/* Banner Image */}
        <div className="h-44 sm:h-64 w-full relative overflow-hidden bg-gradient-to-r from-brand-900 to-indigo-900">
          {storeInfo.banner && (
            <img
              src={storeInfo.banner}
              alt={storeInfo.storeName || seller.name}
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Store Profile Info */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-1 shadow-2xl border-2 border-white/20 shrink-0 overflow-hidden">
              <img
                src={storeInfo.storeLogo || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200'}
                alt={storeInfo.storeName || seller.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {storeInfo.storeName || `${seller.name}'s Store`}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Merchant
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {storeInfo.storeDescription || 'Welcome to our official verified merchant store on DEMO.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Merchant Rating</span>
              <span className="font-extrabold text-amber-300 text-sm">★ {storeInfo.rating || 4.8} / 5</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Products</span>
              <span className="font-extrabold text-white text-sm">{productCount} Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Catalog */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-600" />
          Products by {storeInfo.storeName || seller.name} ({productCount})
        </h2>
      </div>

      <ProductGrid
        products={products}
        emptyTitle="No products listed by this seller yet"
        emptyDescription="Check back soon for new arrivals."
      />
    </div>
  );
};
