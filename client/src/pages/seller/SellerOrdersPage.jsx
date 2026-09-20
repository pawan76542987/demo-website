import React, { useState, useEffect } from 'react';
import { sellerService } from '../../services/sellerService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { OrderStatusBadge } from '../../components/common/Badge';
import { OrderStatusModal } from '../../components/seller/OrderStatusModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await sellerService.getSellerOrders(params);
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenStatusModal = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, itemId, newStatus) => {
    try {
      const res = await sellerService.updateOrderStatus(orderId, { itemId, status: newStatus });
      if (res.success) {
        toast.success(`Item status updated to '${newStatus}'`);
        setStatusModalOpen(false);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order item status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-600" />
            Customer Orders Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Orders containing items purchased from your store • Update shipment and tracking statuses
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, order ID, product..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-semibold hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 bg-white rounded-3xl border border-slate-200/80">
          <LoadingSpinner text="Loading orders..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-slate-200/80 text-center text-slate-400 text-xs">
          No orders found matching your search criteria.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden hover:shadow-card transition-all"
            >
              {/* Order Header */}
              <div className="bg-slate-50/80 p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Order ID</span>
                    <span className="font-mono font-bold text-slate-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Date Placed</span>
                    <span className="font-bold text-slate-800">{formatDate(order.createdAt, true)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Revenue</span>
                    <span className="font-black text-slate-900">{formatCurrency(order.sellerTotal)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
                    <span className="font-bold text-slate-800">
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
              </div>

              {/* Items Table & Shipping Address */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Your Items in this Order ({order.items.length})
                  </h4>

                  <div className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <div key={item._id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                            <p className="text-slate-500">
                              Qty: {item.quantity} × {formatCurrency(item.sellingPrice)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <OrderStatusBadge status={item.itemStatus} />
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(order, item)}
                            className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    Customer Shipping Info
                  </h4>
                  <p className="font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
                  <p className="text-slate-600 font-medium">{order.shippingAddress?.phone}</p>
                  <p className="text-slate-500 leading-relaxed">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fulfillment Status Modal */}
      {selectedOrder && (
        <OrderStatusModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          order={selectedOrder}
          item={selectedItem}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};
