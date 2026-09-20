import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, BarChart2 } from 'lucide-react';

export const SalesMetricsChart = ({ salesData = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!salesData || salesData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        No sales metrics recorded yet.
      </div>
    );
  }

  const maxRevenue = Math.max(...salesData.map((d) => d.revenue), 10000);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
      <div className="flex items-center justify-between pb-6 mb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">Revenue Performance</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Monthly revenue breakdown & orders</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full bg-brand-600" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full bg-indigo-200" />
            Orders
          </span>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
        {salesData.map((item, idx) => {
          const heightPercent = Math.max(10, Math.round((item.revenue / maxRevenue) * 100));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.month || idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-xl shadow-elevation whitespace-nowrap animate-in fade-in zoom-in-95">
                  <p className="font-bold">{formatCurrency(item.revenue)}</p>
                  <p className="text-[10px] text-slate-400">{item.orders} Orders</p>
                </div>
              )}

              {/* Bar */}
              <div className="w-full max-w-[40px] bg-slate-100 rounded-2xl overflow-hidden flex flex-col justify-end p-1 transition-all group-hover:bg-slate-200 h-full">
                <div
                  className="w-full bg-gradient-to-t from-brand-700 to-indigo-500 rounded-xl transition-all duration-500 group-hover:brightness-110 shadow-sm"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Month Label */}
              <span className="text-[11px] font-semibold text-slate-500 mt-2 truncate max-w-[50px] text-center">
                {item.month ? item.month.split(' ')[0] : `M${idx + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
