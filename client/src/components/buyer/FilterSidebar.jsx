import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { CATEGORIES_LIST } from '../../utils/constants';

export const FilterSidebar = ({
  filters,
  categories = CATEGORIES_LIST,
  brands = [],
  onFilterChange,
  onReset
}) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceApply = (e) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      minPrice: minPrice !== '' ? minPrice : undefined,
      maxPrice: maxPrice !== '' ? maxPrice : undefined,
      page: 1
    });
  };

  const handleCategorySelect = (category) => {
    const newCategory = filters.category === category ? '' : category;
    onFilterChange({ ...filters, category: newCategory, page: 1 });
  };

  const handleBrandSelect = (brand) => {
    const newBrand = filters.brand === brand ? '' : brand;
    onFilterChange({ ...filters, brand: newBrand, page: 1 });
  };

  const handleRatingSelect = (rating) => {
    const newRating = filters.rating === rating ? '' : rating;
    onFilterChange({ ...filters, rating: newRating, page: 1 });
  };

  const handleStockToggle = () => {
    onFilterChange({ ...filters, inStock: !filters.inStock, page: 1 });
  };

  return (
    <aside className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-subtle flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h4>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Range (₹)</h4>
        <form onSubmit={handlePriceApply} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-500 focus:bg-white"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-slate-900 hover:bg-brand-600 text-white font-medium text-xs rounded-xl transition shadow-sm"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Brands (if available) */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Brand</h4>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
            {brands.map((brand) => {
              const isSelected = filters.brand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{brand}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Rating</h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((stars) => {
            const isSelected = Number(filters.rating) === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => handleRatingSelect(stars)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition ${
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span>{stars}★ & above</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-slate-800">In Stock Only</span>
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={handleStockToggle}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
};
