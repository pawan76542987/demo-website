import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';
import { DemoPaymentModal } from '../../components/buyer/DemoPaymentModal';
import { AddressModal } from '../../components/buyer/AddressModal';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Banknote,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  Store,
  Truck
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('DEMO_ONLINE'); // 'DEMO_ONLINE' or 'COD'
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultIdx = user.addresses.findIndex((a) => a.isDefault);
      setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
    }
  }, [user]);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Items to Checkout</h2>
        <p className="text-xs text-slate-500 mb-6">Your cart is currently empty.</p>
        <Link to="/products" className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-xs">
          Discover Products
        </Link>
      </div>
    );
  }

  const selectedAddress = user?.addresses?.[selectedAddressIndex] || null;

  const handlePlaceOrderClick = () => {
    if (!selectedAddress) {
      toast.warning('Please select or add a delivery address');
      return;
    }

    if (paymentMethod === 'DEMO_ONLINE') {
      setPaymentModalOpen(true);
    } else {
      processOrderPlacement({ method: 'COD', outcome: 'SUCCESS' });
    }
  };

  const processOrderPlacement = async ({ method, outcome }) => {
    try {
      setLoading(true);

      const payload = {
        items: cart.items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || 'India'
        },
        paymentMethod: method,
        simulatedPaymentOutcome: outcome
      };

      const res = await orderService.createOrder(payload);

      if (res.success && res.order) {
        setPaymentModalOpen(false);
        await refreshCart();
        toast.success('Order placed successfully!');
        navigate(`/buyer/orders/${res.order._id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Lock className="w-6 h-6 text-brand-600" />
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your shipping address, order items and select payment method
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Delivery Address</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddressModalOpen(true)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Address
              </button>
            </div>

            {/* Address Cards */}
            {user?.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedAddressIndex === idx
                        ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {selectedAddressIndex === idx && (
                      <div className="absolute top-3 right-3 text-brand-600">
                        <CheckCircle2 className="w-5 h-5 fill-brand-600 text-white" />
                      </div>
                    )}
                    <p className="font-bold text-xs text-slate-900">{addr.fullName}</p>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{addr.phone}</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-500 mb-3">No addresses saved yet</p>
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(true)}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold text-xs"
                >
                  + Add New Address
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: Order Items Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Order Items ({cart.itemCount})</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity} • {item.product.seller?.storeName || 'Merchant'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-slate-900 shrink-0">
                    {formatCurrency(item.effectivePrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Select Payment Method</h3>
            </div>

            <div className="space-y-3">
              {/* DEMO Online Payment (Recommended) */}
              <label
                onClick={() => setPaymentMethod('DEMO_ONLINE')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  paymentMethod === 'DEMO_ONLINE'
                    ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'DEMO_ONLINE'}
                    onChange={() => setPaymentMethod('DEMO_ONLINE')}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      DEMO Instant Online Payment
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">
                      Instant Confirmation
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Test simulated Cards, UPI, QR, or NetBanking sandbox with instant order generation.
                  </p>
                </div>
                <CreditCard className="w-5 h-5 text-brand-600 shrink-0" />
              </label>

              {/* Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  paymentMethod === 'COD'
                    ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay in cash upon doorstep delivery to your address.
                  </p>
                </div>
                <Banknote className="w-5 h-5 text-slate-600 shrink-0" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Price Summary & Place Order */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle sticky top-24 space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">
              Payment Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Savings</span>
                  <span>- {formatCurrency(cart.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>
                  {cart.deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">Free</span>
                  ) : (
                    formatCurrency(cart.deliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-xl text-brand-600">{formatCurrency(cart.total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrderClick}
              disabled={loading || !selectedAddress}
              className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm transition shadow-md hover:shadow-elevation flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Processing Order...'
              ) : (
                <>
                  <span>
                    {paymentMethod === 'DEMO_ONLINE' ? 'Continue to Demo Payment' : 'Confirm & Place Order'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Escrow Protected Purchase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
      />

      {/* Demo Online Payment Modal */}
      <DemoPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={cart.total}
        loading={loading}
        onProcessPayment={processOrderPlacement}
      />
    </div>
  );
};
