import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductGrid } from '../../components/buyer/ProductGrid';
import { FilterSidebar } from '../../components/buyer/FilterSidebar';
import { Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract query filters from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const filters = {
    search: searchQuery,
    category: categoryParam,
    brand: brandParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    rating: ratingParam,
    inStock: inStockParam,
    sort: sortParam,
    page: pageParam
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (categoryParam) params.category = categoryParam;
      if (brandParam) params.brand = brandParam;
      if (minPriceParam) params.minPrice = minPriceParam;
      if (maxPriceParam) params.maxPrice = maxPriceParam;
      if (ratingParam) params.rating = ratingParam;
      if (inStockParam) params.inStock = true;
      if (sortParam) params.sort = sortParam;
      params.page = pageParam;
      params.limit = 12;

      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.products);
        setTotal(res.total);
        setTotalPages(res.pages);
        if (res.categories) setCategories(res.categories);
        if (res.brands) setBrands(res.brands);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.rating) params.set('rating', newFilters.rating);
    if (newFilters.inStock) params.set('inStock', 'true');
    if (newFilters.sort) params.set('sort', newFilters.sort);
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());

    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setMobileFilterOpen(false);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    handleFilterChange({ ...filters, sort: newSort, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleFilterChange({ ...filters, page: newPage });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            {searchQuery ? (
              <>
                Search Results for{' '}
                <span className="text-brand-600 font-extrabold">"{searchQuery}"</span>
              </>
            ) : categoryParam ? (
              categoryParam
            ) : (
              'All Marketplace Products'
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {total} products found across independent sellers
          </p>
        </div>

        {/* Controls: Mobile Filter Button & Sorting */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Filters
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline font-medium">Sort by:</span>
            <div className="relative">
              <select
                value={sortParam}
                onChange={handleSortChange}
                className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold py-2.5 pl-3.5 pr-8 rounded-xl outline-none cursor-pointer text-xs transition border border-transparent focus:border-brand-500"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discounts</option>
                <option value="popular">Most Popular</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              categories={categories}
              brands={brands}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <ProductGrid
            products={products}
            loading={loading}
            emptyTitle="No products match your search"
            emptyDescription="Try clearing some filters or searching for another keyword."
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              <button
                onClick={() => handlePageChange(pageParam - 1)}
                disabled={pageParam <= 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isCurrent = p === pageParam;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                        isCurrent
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-white border border-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pageParam + 1)}
                disabled={pageParam >= totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative min-h-screen flex items-end sm:items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
              <FilterSidebar
                filters={filters}
                categories={categories}
                brands={brands}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
