import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col space-y-3 overflow-hidden shadow-subtle">
    <div className="w-full aspect-square rounded-xl bg-slate-200 animate-shimmer" />
    <div className="h-4 bg-slate-200 rounded w-3/4 animate-shimmer" />
    <div className="h-3 bg-slate-200 rounded w-1/2 animate-shimmer" />
    <div className="flex justify-between items-center pt-2">
      <div className="h-6 bg-slate-200 rounded w-1/3 animate-shimmer" />
      <div className="h-8 bg-slate-200 rounded w-20 animate-shimmer" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-slate-100 animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded w-full" />
      </td>
    ))}
  </tr>
);
