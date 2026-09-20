import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Package, ChevronRight, Store, ArrowRight } from 'lucide-react';

export const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" text="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Package className="w-7 h-7 text-brand-600" />
          My Orders & Purchases ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track packages, view receipts, and submit verified product feedback
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Placed Yet"
          description="Looks like you haven't bought anything on DEMO yet. Discover trending deals today!"
          actionText="Start Shopping"
          actionLink="/products"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle hover:shadow-card transition-all"
            >
              {/* Order Card Header */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Placed</span>
                    <span className="font-bold text-slate-800">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                    <span className="font-black text-slate-900">{formatCurrency(order.total)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ship To</span>
                    <span className="font-bold text-slate-800">{order.shippingAddress?.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.orderStatus} />
                  <span className="text-[11px] font-mono text-slate-400">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-6 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity} • {formatCurrency(item.sellingPrice)} each
                        </p>
                        {item.sellerId && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Store className="w-3 h-3" />
                            Sold by: <span className="font-semibold text-slate-600">{item.sellerId.storeInfo?.storeName || item.sellerId.name}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <Link
                        to={`/buyer/orders/${order._id}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                      >
                        <span>View Order Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
