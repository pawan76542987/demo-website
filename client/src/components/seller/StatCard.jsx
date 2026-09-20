import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  trend
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between hover:shadow-card transition-all">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center shrink-0 border ${scheme.border} shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
