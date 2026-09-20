import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const AddressModal = ({ isOpen, onClose, onAddressSaved }) => {
  const { addAddress } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
      toast.warning('Please fill in all required address fields');
      return;
    }

    try {
      setLoading(true);
      const res = await addAddress(formData);
      if (res.success) {
        if (onAddressSaved) onAddressSaved(formData);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Delivery Address"
      subtitle="Addresses will be securely saved to your account"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Street Address / House No. *</label>
          <input
            type="text"
            name="street"
            required
            value={formData.street}
            onChange={handleChange}
            placeholder="Flat 402, Green Valley Heights, MG Road"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">City *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Bengaluru"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">State *</label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              placeholder="Karnataka"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
            <input
              type="text"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="560001"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <span className="text-xs font-medium text-slate-700">Set as my default delivery address</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-sm"
          >
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
