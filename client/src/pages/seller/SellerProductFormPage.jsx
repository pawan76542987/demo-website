import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Layers,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Save,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES_LIST } from '../../utils/constants';

export const SellerProductFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    brand: '',
    price: '',
    discount: '0',
    stock: '10',
    sku: '',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    specifications: [
      { key: 'Warranty', value: '1 Year Brand Warranty' },
      { key: 'Country of Origin', value: 'India' }
    ],
    status: 'active'
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await productService.getProductById(id);
          if (res.success && res.product) {
            const p = res.product;
            setFormData({
              name: p.name || '',
              description: p.description || '',
              category: p.category || 'Electronics',
              brand: p.brand || '',
              price: p.price !== undefined ? p.price.toString() : '',
              discount: p.discount !== undefined ? p.discount.toString() : '0',
              stock: p.stock !== undefined ? p.stock.toString() : '0',
              sku: p.sku || '',
              images: p.images && p.images.length > 0 ? p.images : [''],
              specifications: p.specifications && p.specifications.length > 0 ? p.specifications : [],
              status: p.status || 'active'
            });
          }
        } catch (err) {
          toast.error('Failed to load product details for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    if (formData.images.length <= 1) {
      toast.warning('Product must have at least one image');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      setUploading(true);
      const res = await productService.uploadImage(uploadFormData);
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, res.url]
        }));
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.specifications];
      updated[index][field] = value;
      return { ...prev, specifications: updated };
    });
  };

  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.brand || !formData.price || !formData.stock) {
      toast.warning('Please fill in all mandatory fields');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
        images: formData.images.filter(Boolean),
        specifications: formData.specifications.filter(s => s.key && s.value),
        status: formData.status
      };

      if (isEditMode) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        toast.success('Product published to DEMO marketplace!');
      }

      navigate('/seller/products');
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading product data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-4">
          <Link
            to="/seller/products"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isEditMode ? 'Edit Product Listing' : 'List New Marketplace Product'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in detailed product specifications, images and inventory units
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4 text-xs sm:text-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            1. Basic Information
          </h2>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Title / Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. AcousticPro ANC Wireless Headphones"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition font-semibold"
              >
                {CATEGORIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony, Nike, AcousticPro"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU (Stock Keeping Unit)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. AP-ANC-001"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe product highlights, materials, warranty, battery life, or key selling points..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition resize-none"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4 text-xs sm:text-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            2. Pricing & Inventory Units
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Original Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="14999"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Percentage (%)</label>
              <input
                type="number"
                name="discount"
                min="0"
                max="99"
                value={formData.discount}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Stock Units *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition font-bold"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4 text-xs sm:text-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            3. Product Images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {formData.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group"
              >
                <img src={imgUrl} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL (Unsplash, CDN, etc.)..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white outline-none transition"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl font-bold transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add URL
              </button>
            </div>

            <label className="px-4 py-2.5 bg-brand-50 border border-brand-200 hover:bg-brand-100 text-brand-700 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Technical Specifications
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Specification Row
            </button>
          </div>

          <div className="space-y-3">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Key (e.g. Battery Life)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="w-1/3 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none transition font-semibold"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 40 Hours)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/seller/products"
            className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm transition shadow-md hover:shadow-elevation flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : isEditMode ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
