import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sellerService } from '../../services/sellerService';
import { StatCard } from '../../components/seller/StatCard';
import { SalesMetricsChart } from '../../components/seller/SalesMetricsChart';
import { OrderStatusBadge } from '../../components/common/Badge';
import { OrderStatusModal } from '../../components/seller/OrderStatusModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import {
  Layers,
  Package,
  IndianRupee,
  Clock,
  AlertTriangle,
  PlusCircle,
  Boxes,
  Store,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const SellerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const toast = useToast();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getDashboardStats();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to load seller dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleOpenStatusModal = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, itemId, newStatus) => {
    try {
      const res = await sellerService.updateOrderStatus(orderId, { itemId, status: newStatus });
      if (res.success) {
        toast.success(`Fulfillment status updated to ${newStatus}`);
        setStatusModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading merchant analytics..." />
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recentOrders || [];
  const salesAnalytics = dashboardData?.salesAnalytics || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Merchant Overview Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics, sales volume, inventory status, and pending fulfillments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/seller/products/new"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Product</span>
          </Link>
          <Link
            to="/seller/inventory"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-2"
          >
            <Boxes className="w-4 h-4" />
            <span>Inventory</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Sales Revenue"
          value={formatCurrency(stats.totalSales || 0)}
          subtitle="Direct earnings from your products"
          icon={IndianRupee}
          color="emerald"
          trend="+18.4% vs last mo"
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          subtitle={`${stats.completedOrders || 0} Delivered`}
          icon={Package}
          color="indigo"
        />

        <StatCard
          title="Active Products"
          value={stats.totalProducts || 0}
          subtitle="In your public storefront"
          icon={Layers}
          color="purple"
        />

        <StatCard
          title="Action Needed"
          value={`${stats.pendingOrders || 0} Orders`}
          subtitle={`${stats.lowStockProducts || 0} Low-Stock items`}
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* Interactive Sales Chart */}
      <SalesMetricsChart salesData={salesAnalytics} />

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing orders containing products from your store</p>
          </div>
          <Link
            to="/seller/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All Orders
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No customer orders received yet. When buyers purchase your items, they will appear here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Your Items</th>
                  <th className="pb-3 px-3">Your Revenue</th>
                  <th className="pb-3 px-3">Fulfillment Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">{order.buyer?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        {order.items.map((i) => (
                          <div key={i._id} className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">{i.name}</span>
                            <span className="text-slate-400">x{i.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-black text-slate-900">
                      {formatCurrency(order.sellerTotal)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1">
                        {order.items.map((i) => (
                          <OrderStatusBadge key={i._id} status={i.itemStatus} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(order, order.items[0])}
                        className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
