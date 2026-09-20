import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sellerService } from '../../services/sellerService';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatters';
import { StockBadge } from '../../components/common/Badge';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import {
  Layers,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Filter
} from 'lucide-react';
import { CATEGORIES_LIST } from '../../utils/constants';

export const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (stockFilter !== 'All') params.stockFilter = stockFilter;

      const res = await sellerService.getSellerProducts(params);
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, stockFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      const res = await productService.deleteProduct(productToDelete._id);
      if (res.success) {
        toast.success(`Product "${productToDelete.name}" deleted successfully`);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-600" />
            Product Catalog Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store's listings, update prices, adjust inventory & review active listings
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, brand, SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
          />
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
          >
            <option value="All">All Stock Levels</option>
            <option value="in">In Stock (10+)</option>
            <option value="low">Low Stock (&lt;10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner text="Loading products..." />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No products found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">Inventory Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {product.brand} • SKU: {product.sku || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {product.category}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(product.price * (1 - (product.discount || 0) / 100))}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-[11px] text-emerald-600 block">
                          ({product.discount}% OFF)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <StockBadge stock={product.stock} />
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {product.status || 'Active'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition"
                          title="View in Marketplace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/seller/products/${product._id}/edit`}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(product)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product Confirmation"
        message={`Are you sure you want to delete "${productToDelete?.name}"? It will be immediately removed from the marketplace.`}
        confirmText="Yes, Delete Product"
        cancelText="Keep Product"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
};
