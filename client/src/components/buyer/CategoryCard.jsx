import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 flex flex-col justify-end p-5 shadow-card hover:shadow-elevation transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={category.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

      {/* Category Info */}
      <div className="relative z-10 flex items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-brand-300 transition">
            {category.name}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
            {category.description || 'Explore top rated products'}
          </p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};
