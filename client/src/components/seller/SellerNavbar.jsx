import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Store, ShoppingCart, LogOut, Bell, ShieldCheck } from 'lucide-react';

export const SellerNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white">
      {/* Brand & Store Badge */}
      <div className="flex items-center gap-4">
        <Link to="/seller" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center font-extrabold text-lg shadow-md">
            D
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight">DEMO</span>
            <span className="text-[11px] font-semibold text-accent-400 block -mt-1 uppercase tracking-wider">
              Seller Hub
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">
            {user?.storeInfo?.storeName || `${user?.name}'s Store`}
          </span>
          <span className="text-[10px] bg-slate-800 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
            Verified Merchant
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Switch to Marketplace View */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition border border-slate-700"
          title="Browse Marketplace as Customer"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-accent-400" />
          <span>Switch to Marketplace</span>
        </Link>

        {/* User initials & Logout */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
