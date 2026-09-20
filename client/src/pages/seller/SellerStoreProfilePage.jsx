import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Store, Image as ImageIcon, Save, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SellerStoreProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const storeInfo = user?.storeInfo || {};

  const [storeName, setStoreName] = useState(storeInfo.storeName || `${user?.name}'s Store`);
  const [storeDescription, setStoreDescription] = useState(
    storeInfo.storeDescription || 'Authorized verified merchant on DEMO marketplace.'
  );
  const [storeLogo, setStoreLogo] = useState(
    storeInfo.storeLogo || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200'
  );
  const [banner, setBanner] = useState(
    storeInfo.banner || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200'
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile({
        storeName,
        storeDescription,
        storeLogo,
        banner
      });
      if (res.success) {
        toast.success('Store profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update store profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-brand-600" />
            Public Store Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize how your brand, store banner, and logo appear to marketplace buyers
          </p>
        </div>

        <Link
          to={`/store/${user?._id}`}
          target="_blank"
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-brand-600" />
          <span>View Public Storefront</span>
        </Link>
      </div>

      {/* Live Preview Card */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden text-white border border-slate-800 shadow-card">
        <div className="h-32 w-full relative overflow-hidden bg-brand-900">
          {banner && (
            <img src={banner} alt="Banner Preview" className="w-full h-full object-cover opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        <div className="p-6 -mt-12 relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md shrink-0 overflow-hidden">
            <img
              src={storeLogo || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200'}
              alt="Logo Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">{storeName}</h3>
            <p className="text-xs text-slate-300 line-clamp-1">{storeDescription}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Store / Business Name *</label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition font-semibold"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Store Tagline / Bio *</label>
          <textarea
            rows="3"
            required
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Store Logo Image URL</label>
            <input
              type="url"
              value={storeLogo}
              onChange={(e) => setStoreLogo(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Store Banner Image URL</label>
            <input
              type="url"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Store Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
