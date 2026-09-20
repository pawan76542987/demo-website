import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Store, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { StarRating } from '../common/StarRating';
import { DiscountBadge, StockBadge } from '../common/Badge';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export const ProductCard = ({ product }) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const originalPrice = product.price;
  const discount = product.discount || 0;
  const sellingPrice = discount > 0 
    ? Math.round(originalPrice - (originalPrice * (discount / 100))) 
    : originalPrice;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const result = await addToCart(product._id, 1);
    setAdding(false);

    if (result.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-brand-300 overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col h-full">
      {/* Product Image & Badges */}
      <Link to={`/products/${product._id}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && <DiscountBadge discount={discount} />}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md transition shadow-sm z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white border border-white/60'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Stock overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-xl tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand and Seller */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
            <span className="font-semibold text-brand-600 tracking-wide uppercase text-[11px] truncate">
              {product.brand || product.category}
            </span>
            {product.sellerId && (
              <span className="text-slate-400 text-[11px] flex items-center gap-1 shrink-0 truncate max-w-[110px]" title={product.sellerId.storeInfo?.storeName || product.sellerId.name}>
                <Store className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{product.sellerId.storeInfo?.storeName || product.sellerId.name}</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-brand-600 transition leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="xs" />
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatCurrency(sellingPrice)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <div className="mt-0.5">
              <StockBadge stock={product.stock} />
            </div>
          </div>

          {/* Add to Cart Quick Action */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-2xl font-semibold text-xs transition flex items-center gap-1.5 shrink-0 shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-elevation'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
