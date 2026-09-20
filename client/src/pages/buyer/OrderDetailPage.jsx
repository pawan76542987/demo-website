import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';
import { OrderTrackerTimeline } from '../../components/buyer/OrderTrackerTimeline';
import { ReviewModal } from '../../components/buyer/ReviewModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import {
  Package,
  ArrowLeft,
  Store,
  MessageSquarePlus,
  Ban,
  Printer,
  ShieldCheck,
  CreditCard,
  MapPin,
  Clock
} from 'lucide-react';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      if (res.success) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(id);
      if (res.success) {
        toast.success('Order has been cancelled successfully.');
        setCancelDialogOpen(false);
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleOpenReview = (item) => {
    setSelectedProductForReview({
      _id: item.productId,
      name: item.name
    });
    setReviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" text="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <Link to="/buyer/orders" className="text-brand-600 font-bold text-xs mt-4">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  const canCancel = ['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/buyer/orders"
          className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Orders
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelDialogOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-100 transition flex items-center gap-1.5 shadow-sm"
            >
              <Ban className="w-4 h-4" />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden mb-8">
        {/* Order Header Summary */}
        <div className="bg-slate-50/80 p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-black text-slate-900">
                Order #{order._id.toUpperCase()}
              </h1>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <p className="text-xs text-slate-500">
              Placed on {formatDate(order.createdAt, true)} • Payment: <span className="font-semibold text-slate-700">{order.paymentMethod}</span> ({order.paymentStatus})
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">Total Amount</span>
            <span className="text-2xl font-black text-brand-600">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Real-time Order Tracking Timeline */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Fulfillment Progress
          </h3>
          <OrderTrackerTimeline currentStatus={order.orderStatus} />
        </div>

        {/* Purchased Items List */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Items in this Order ({order.items.length})
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-bold text-xs sm:text-sm text-slate-900 hover:text-brand-600 line-clamp-2 transition leading-snug"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} • Unit Price: {formatCurrency(item.sellingPrice)}
                    </p>
                    {item.sellerId && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        Merchant: <span className="font-semibold text-slate-700">{item.sellerId.storeInfo?.storeName || item.sellerId.name}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <span className="text-base font-black text-slate-900">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenReview(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    Write Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 2-Col Info: Address & Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Delivery Shipping Address</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
            <p className="font-semibold text-slate-700">{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment & Invoice Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <CreditCard className="w-4 h-4 text-brand-600" />
            <span>Invoice & Payment Summary</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Savings</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline font-black text-sm text-slate-900">
              <span>Grand Total</span>
              <span className="text-lg text-brand-600">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {order.paymentDetails?.transactionId && (
            <div className="pt-2 text-[11px] text-slate-400 font-mono">
              Transaction ID: {order.paymentDetails.transactionId}
            </div>
          )}
        </div>
      </div>

      {/* Review Dialog */}
      {selectedProductForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          product={selectedProductForReview}
          onReviewSubmitted={fetchOrder}
        />
      )}

      {/* Cancel Order Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Order Confirmation"
        message="Are you sure you want to cancel this order? Any reserved stock will be immediately released back to the marketplace."
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        isDanger={true}
        loading={cancelling}
      />
    </div>
  );
};
