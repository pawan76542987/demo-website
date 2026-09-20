import React from 'react';
import { Check, Clock, PackageCheck, Truck, MapPin, AlertCircle } from 'lucide-react';
import { ORDER_STATUS_STEPS } from '../../utils/constants';

export const OrderTrackerTimeline = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <p className="text-sm font-bold">This order has been cancelled.</p>
          <p className="text-xs text-rose-600 mt-0.5">Stock has been restored and no further actions will be taken.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'Confirmed', label: 'Order Confirmed', icon: Clock },
    { key: 'Processing', label: 'Processing at Hub', icon: PackageCheck },
    { key: 'Shipped', label: 'Shipped with Courier', icon: Truck },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin },
    { key: 'Delivered', label: 'Delivered', icon: Check }
  ];

  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const activeIdx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="py-6 px-2 sm:px-4">
      <div className="relative flex items-center justify-between">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isPassed = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isFuture = idx > activeIdx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                  isPassed
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isPassed ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-2 font-bold text-center max-w-[75px] sm:max-w-[100px] leading-tight ${
                  isCurrent
                    ? 'text-brand-700 font-extrabold'
                    : isPassed
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
