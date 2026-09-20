import React from 'react';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'We couldn\'t find anything matching your criteria.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-sm hover:shadow-elevation"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-sm hover:shadow-elevation"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
