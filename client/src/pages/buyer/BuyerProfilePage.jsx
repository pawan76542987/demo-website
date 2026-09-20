import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { AddressModal } from '../../components/buyer/AddressModal';
import { User, Phone, Mail, MapPin, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const BuyerProfilePage = () => {
  const { user, updateProfile, deleteAddress, setDefaultAddress } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const toast = useToast();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile({ name, phone });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-brand-600" />
          My Profile & Saved Addresses
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details and shipping locations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Personal Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-6">
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-3xl bg-brand-100 text-brand-700 font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-base text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-400 capitalize">{user?.role} Account</p>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-sm"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Saved Addresses Manager */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-base text-slate-900">Saved Delivery Addresses</h3>
              </div>

              <button
                type="button"
                onClick={() => setAddressModalOpen(true)}
                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>

            {user?.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-5 rounded-2xl border-2 transition flex flex-col justify-between ${
                      addr.isDefault
                        ? 'border-brand-600 bg-brand-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{addr.phone}</p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(addr._id)}
                          className="font-bold text-brand-600 hover:text-brand-700 transition"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-auto"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                No delivery addresses added yet. Click "Add New Address" above.
              </div>
            )}
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
      />
    </div>
  );
};
