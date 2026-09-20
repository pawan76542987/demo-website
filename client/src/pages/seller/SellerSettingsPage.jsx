import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Settings, ShieldCheck, Building2, Bell, Lock, Save } from 'lucide-react';

export const SellerSettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [orderPushAlerts, setOrderPushAlerts] = useState(true);
  const [bankAccount, setBankAccount] = useState('DEMO-SBI-987654321');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name, phone });
    setSaving(false);
    toast.success('Merchant settings updated successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-600" />
          Merchant Settings & Payout Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your seller credentials, automated payout accounts, and notification alerts
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs sm:text-sm">
        {/* Payout Banking Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Automated Settlement Account</h2>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
            Weekly payouts are automatically transferred to this verified merchant bank account every Monday.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Number / IBAN</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank IFSC / SWIFT Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 font-mono outline-none uppercase"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-sm">Merchant Notifications</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-slate-900">Instant Order Email Notifications</p>
                <p className="text-xs text-slate-500">Receive email alerts whenever a customer purchases your items</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-slate-900">Low Stock Inventory Warnings</p>
                <p className="text-xs text-slate-500">Notify me immediately when product units drop below 10</p>
              </div>
              <input
                type="checkbox"
                checked={orderPushAlerts}
                onChange={(e) => setOrderPushAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
