import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Store } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { StockBadge } from '../../components/common/Badge';

export const CartPage = () => {
  const { cart, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Explore millions of products across thousands of categories and discover great deals."
          actionText="Start Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  const freeDeliveryThreshold = 499;
  const progressToFreeDelivery = Math.min(100, Math.round(((cart.subtotal - cart.discount) / freeDeliveryThreshold) * 100));

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-brand-600" />
            Shopping Cart ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Items in your cart are sourced directly from verified sellers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Progress Alert */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-600" />
                {cart.deliveryFee === 0 ? (
                  <span className="text-emerald-600">🎉 Congratulations! You unlocked Free Standard Delivery</span>
                ) : (
                  <span>
                    Add <span className="font-extrabold text-brand-600">{formatCurrency(freeDeliveryThreshold - (cart.subtotal - cart.discount))}</span> more for Free Delivery
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-slate-400">{progressToFreeDelivery}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>

          {/* Cart Item Cards */}
          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 shadow-subtle overflow-hidden">
            {cart.items.map((item) => (
              <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200"
                  >
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <Link to={`/products/${item.product._id}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-600 line-clamp-2 transition leading-snug">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.seller && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        Sold by: <span className="font-semibold text-slate-600">{item.product.seller.storeName}</span>
                      </p>
                    )}
                    <div className="pt-1">
                      <StockBadge stock={item.product.stock} />
                    </div>
                  </div>
                </div>

                {/* Price & Quantity Adjuster */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-slate-900">
                      {formatCurrency(item.effectivePrice * item.quantity)}
                    </div>
                    {item.discount > 0 && (
                      <div className="text-xs text-slate-400 line-through">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        className="p-1.5 hover:bg-slate-200 disabled:opacity-40 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || loading}
                        className="p-1.5 hover:bg-slate-200 disabled:opacity-40 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Item button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Price Breakdown Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle sticky top-24 space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">
              Price Details
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Price ({cart.itemCount} items)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Total Discount</span>
                  <span>- {formatCurrency(cart.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span>
                  {cart.deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">Free</span>
                  ) : (
                    formatCurrency(cart.deliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>Total Payable Amount</span>
                <span className="text-xl text-brand-600">{formatCurrency(cart.total)}</span>
              </div>
            </div>

            {cart.discount > 0 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 font-bold text-center">
                You will save {formatCurrency(cart.discount)} on this order!
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm transition shadow-md hover:shadow-elevation flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure Escrow Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
