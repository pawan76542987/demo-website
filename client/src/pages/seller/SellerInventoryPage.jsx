import React, { useState, useEffect } from 'react';
import { sellerService } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatters';
import { StockBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import {
  Boxes,
  AlertTriangle,
  Search,
  Save,
  Check,
  Plus,
  Minus
} from 'lucide-react';

export const SellerInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [stockEdits, setStockEdits] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getSellerProducts({ limit: 100 });
      if (res.success) {
        setProducts(res.products);
        const initial = {};
        res.products.forEach((p) => {
          initial[p._id] = p.stock;
        });
        setStockEdits(initial);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = (productId, newStock) => {
    const parsed = Math.max(0, parseInt(newStock, 10) || 0);
    setStockEdits((prev) => ({ ...prev, [productId]: parsed }));
  };

  const handleSaveStock = async (productId) => {
    const stockToSave = stockEdits[productId];
    if (stockToSave === undefined) return;

    try {
      setSavingId(productId);
      const res = await sellerService.updateQuickStock(productId, stockToSave);
      if (res.success) {
        toast.success('Inventory stock updated!');
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, stock: stockToSave } : p))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update stock');
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-brand-600" />
            Inventory Stock Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quickly adjust available stock numbers in real-time across your product catalog
          </p>
        </div>
      </div>

      {/* Stock Alert Summary */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-amber-900 font-semibold">
            <AlertTriangle className="w-5 h-5 text-accent-500 shrink-0" />
            <span>
              Inventory Alert: You have <span className="font-extrabold text-amber-900">{lowStockCount} low-stock</span> and{' '}
              <span className="font-extrabold text-rose-700">{outOfStockCount} out-of-stock</span> products.
            </span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between text-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog to adjust stock..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner text="Loading inventory items..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            No matching inventory products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Current Stock Status</th>
                  <th className="py-3.5 px-4">Adjust Available Units</th>
                  <th className="py-3.5 px-4 text-right">Quick Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const currentEdit = stockEdits[product._id] ?? product.stock;
                  const isModified = currentEdit !== product.stock;

                  return (
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
                              {product.category} • SKU: {product.sku || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        {formatCurrency(product.price * (1 - (product.discount || 0) / 100))}
                      </td>

                      <td className="py-4 px-4">
                        <StockBadge stock={product.stock} />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleStockChange(product._id, currentEdit - 1)}
                              disabled={currentEdit <= 0}
                              className="p-2 hover:bg-slate-200 disabled:opacity-30 transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentEdit}
                              onChange={(e) => handleStockChange(product._id, e.target.value)}
                              className="w-16 text-center font-bold text-xs bg-transparent outline-none py-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => handleStockChange(product._id, currentEdit + 1)}
                              className="p-2 hover:bg-slate-200 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {isModified && (
                            <span className="text-[10px] font-bold text-amber-600 animate-pulse">
                              (Unsaved)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveStock(product._id)}
                          disabled={!isModified || savingId === product._id}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 ml-auto shadow-sm ${
                            isModified
                              ? 'bg-brand-600 hover:bg-brand-700 text-white'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingId === product._id ? 'Saving...' : 'Save'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
