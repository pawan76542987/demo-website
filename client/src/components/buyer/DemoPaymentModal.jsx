import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CreditCard, QrCode, Building2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DemoPaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  onProcessPayment,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card', 'upi', 'netbanking'
  const [outcome, setOutcome] = useState('SUCCESS'); // 'SUCCESS' or 'FAILURE'

  const handleSubmit = (selectedOutcome) => {
    onProcessPayment({
      method: 'DEMO_ONLINE',
      outcome: selectedOutcome,
      paymentTab: activeTab
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DEMO Instant Payment Gateway"
      subtitle="Portfolio Mock Payment System • No real money charged"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        {/* Safe Sandbox Alert */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
          <ShieldCheck className="w-5 h-5 text-accent-500 shrink-0" />
          <div>
            <span className="font-bold">SAFE DEMO SIMULATION:</span> This is a mock sandbox. You can test both successful checkout and simulated card failure below.
          </div>
        </div>

        {/* Amount to pay */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-elevation">
          <div>
            <p className="text-xs text-slate-400">Total Payable Amount</p>
            <p className="text-2xl font-black text-accent-400">{formatCurrency(totalAmount)}</p>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2.5 py-1 rounded-full border border-slate-700">
            256-Bit SSL Encrypted
          </span>
        </div>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'card'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Card
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upi')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'upi'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            UPI / QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('netbanking')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'netbanking'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            NetBanking
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'card' && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Demo Card Number</label>
              <input
                type="text"
                readOnly
                value="4242 •••• •••• 4242"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Valid Thru</label>
                <input
                  type="text"
                  readOnly
                  value="12 / 28"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">CVV</label>
                <input
                  type="password"
                  readOnly
                  value="•••"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upi' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-2">
            <div className="w-24 h-24 bg-white border-2 border-dashed border-slate-300 rounded-2xl mx-auto flex items-center justify-center text-slate-400 font-mono text-[10px]">
              [ DEMO QR CODE ]
            </div>
            <p className="text-xs font-semibold text-slate-800">Demo VPA: buyer@demobank</p>
            <p className="text-[11px] text-slate-500">Scan using any simulated UPI application</p>
          </div>
        )}

        {activeTab === 'netbanking' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <p className="font-semibold text-slate-700">Select Simulated Bank:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="p-2 bg-white rounded-xl border border-brand-500 text-brand-700 font-bold text-center">
                State Bank of DEMO
              </span>
              <span className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 text-center">
                HDFC Simulated
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons for Simulation Testing */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSubmit('FAILURE')}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            Simulate Payment Failure
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('SUCCESS')}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md hover:shadow-elevation"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Simulate Successful Pay
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
