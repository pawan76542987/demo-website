import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ORDER_STATUS_COLORS } from '../../utils/constants';

export const OrderStatusModal = ({
  isOpen,
  onClose,
  order,
  item,
  onUpdateStatus,
  loading = false
}) => {
  const [selectedStatus, setSelectedStatus] = useState(item?.itemStatus || 'Confirmed');

  const statuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(order._id, item?._id, selectedStatus);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Fulfillment Status"
      subtitle={`Order #${order?._id?.slice(-8).toUpperCase()} • Item: ${item?.name || 'Product'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-xs">
            Select New Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none font-semibold text-slate-900 transition"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Status Preview Tag */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Preview Badge:</span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${ORDER_STATUS_COLORS[selectedStatus]}`}>
            {selectedStatus}
          </span>
        </div>

        {/* Customer Address Preview */}
        {order?.shippingAddress && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-slate-700">Shipping To:</p>
            <p className="text-slate-600 font-medium">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
            <p className="text-slate-500">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
            {loading ? 'Updating...' : 'Save Status'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
