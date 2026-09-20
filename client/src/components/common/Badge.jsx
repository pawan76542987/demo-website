import React from 'react';
import { ORDER_STATUS_COLORS } from '../../utils/constants';

export const StockBadge = ({ stock }) => {
  const num = Number(stock);
  if (num <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        Out of Stock
      </span>
    );
  }
  if (num < 10) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
        Only {num} left!
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      In Stock ({num})
    </span>
  );
};

export const DiscountBadge = ({ discount }) => {
  if (!discount || Number(discount) <= 0) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-sm tracking-tight">
      {discount}% OFF
    </span>
  );
};

export const OrderStatusBadge = ({ status }) => {
  const colorClass = ORDER_STATUS_COLORS[status] || 'bg-slate-100 text-slate-800 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status}
    </span>
  );
};
