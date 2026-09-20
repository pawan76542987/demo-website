import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, Store, Lock, Mail, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const demoParam = searchParams.get('demo');

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-fill demo credentials if clicked from quick access
  useEffect(() => {
    if (demoParam === 'buyer') {
      setRole('buyer');
      setEmail('buyer@demo.com');
      setPassword('Password123!');
    } else if (demoParam === 'seller1') {
      setRole('seller');
      setEmail('seller1@demo.com');
      setPassword('Password123!');
    } else if (demoParam === 'seller2') {
      setRole('seller');
      setEmail('seller2@demo.com');
      setPassword('Password123!');
    }
  }, [demoParam]);

  const handleQuickDemo = (demoType) => {
    if (demoType === 'buyer') {
      setRole('buyer');
      setEmail('buyer@demo.com');
      setPassword('Password123!');
    } else if (demoType === 'seller1') {
      setRole('seller');
      setEmail('seller1@demo.com');
      setPassword('Password123!');
    } else if (demoType === 'seller2') {
      setRole('seller');
      setEmail('seller2@demo.com');
      setPassword('Password123!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await login({
      email,
      password,
      requiredRole: role
    });

    setLoading(false);

    if (res.success) {
      const redirect = searchParams.get('redirect');
      if (res.user.role === 'seller') {
        navigate('/seller');
      } else {
        navigate(redirect || '/products');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 sm:p-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-elevation p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              D
            </div>
            <span className="text-2xl font-black text-slate-900">DEMO</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900">
            {role === 'seller' ? 'Seller Portal Login' : 'Buyer Sign In'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'seller'
              ? 'Manage your store, inventory & customer orders'
              : 'Sign in to access your orders, cart & wishlist'}
          </p>
        </div>

        {/* Portal Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'buyer'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'seller'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            Seller Portal
          </button>
        </div>

        {/* Quick Autofill Buttons for Testing */}
        <div className="mb-6 p-3.5 bg-brand-50/70 border border-brand-100 rounded-2xl">
          <div className="flex items-center gap-1 text-[11px] font-bold text-brand-800 mb-2">
            <Zap className="w-3.5 h-3.5 text-accent-500" />
            1-Click Demo Credentials:
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('buyer')}
              className="px-2.5 py-1 bg-white hover:bg-brand-100 border border-brand-200 text-brand-700 rounded-lg text-[11px] font-medium transition"
            >
              Demo Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('seller1')}
              className="px-2.5 py-1 bg-white hover:bg-brand-100 border border-brand-200 text-brand-700 rounded-lg text-[11px] font-medium transition"
            >
              Apex Tech (Seller)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('seller2')}
              className="px-2.5 py-1 bg-white hover:bg-brand-100 border border-brand-200 text-brand-700 rounded-lg text-[11px] font-medium transition"
            >
              Urban Vogue (Seller)
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white transition flex items-center justify-center gap-2 shadow-sm ${
              role === 'seller'
                ? 'bg-slate-900 hover:bg-slate-800'
                : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <span>Sign In as {role === 'seller' ? 'Seller' : 'Buyer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link
            to={`/register?role=${role}`}
            className="font-bold text-brand-600 hover:text-brand-700 underline"
          >
            Register as {role === 'seller' ? 'Seller' : 'Buyer'}
          </Link>
        </div>
      </div>
    </div>
  );
};
