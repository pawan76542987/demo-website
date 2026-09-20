import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchBar = ({ initialQuery = '', placeholder = 'Search 10,000+ products, brands & categories...' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const trendingSearches = [
    'Wireless Headphones',
    'OLED Laptop',
    'Linen Shirt',
    'Ergonomic Chair',
    'Vitamin C Serum',
    'Arabica Coffee'
  ];

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-2xl border border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Suggested & Trending searches dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-elevation border border-slate-200/80 p-4 z-40 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
            Trending Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  setIsOpen(false);
                  navigate(`/products?search=${encodeURIComponent(term)}`);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 border border-slate-200 hover:border-brand-200 rounded-xl text-xs font-medium text-slate-700 transition flex items-center gap-1"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
