import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ShoppingBag, Store, Lock, Mail, User, Phone, MapPin, Building, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeDescription: '',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }

    if (role === 'seller' && !formData.storeName.trim()) {
      toast.warning('Please provide your Store / Business Name');
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role,
      storeName: formData.storeName,
      storeDescription: formData.storeDescription,
      address: {
        fullName: formData.name,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'India',
        isDefault: true
      }
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      if (role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/products');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 sm:p-8 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-elevation p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              D
            </div>
            <span className="text-2xl font-black text-slate-900">DEMO</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900">
            {role === 'seller' ? 'Create a Seller Merchant Account' : 'Create a Buyer Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'seller'
              ? 'Start listing your products to buyers across India'
              : 'Join DEMO marketplace to enjoy thousands of deals'}
          </p>
        </div>

        {/* Role Tabs */}
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
            Seller
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Seller Specific: Store Name */}
          {role === 'seller' && (
            <div className="p-4 bg-brand-50/50 border border-brand-100 rounded-2xl space-y-3">
              <h4 className="font-bold text-brand-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Building className="w-4 h-4 text-brand-600" />
                Store Information
              </h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  name="storeName"
                  required={role === 'seller'}
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="e.g. Nexus Electronics Store"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-brand-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Bio / Description</label>
                <input
                  type="text"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="e.g. Authorized seller of gaming tech & accessories"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-brand-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {role === 'seller' ? 'Owner / Contact Name *' : 'Full Name *'}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Optional Initial Address */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              {role === 'seller' ? 'Business Address (Optional)' : 'Default Delivery Address (Optional)'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street / Flat No."
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-500 focus:bg-white"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City (e.g. Bengaluru)"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-500 focus:bg-white"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State (e.g. Karnataka)"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-500 focus:bg-white"
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="PIN Code (e.g. 560001)"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <span>Register as {role === 'seller' ? 'Merchant' : 'Buyer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            to={`/login?role=${role}`}
            className="font-bold text-brand-600 hover:text-brand-700 underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
