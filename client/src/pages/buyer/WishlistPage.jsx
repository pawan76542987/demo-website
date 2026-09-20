import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { formatCurrency, calculateDiscountedPrice } from '../../utils/formatters';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { StarRating } from '../../components/common/StarRating';
import { StockBadge } from '../../components/common/Badge';

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist, moveToCart, loading } = useWishlist();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save items you love by clicking the heart icon on any product card."
          actionText="Explore Marketplace"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          My Saved Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Items saved to your personal wishlist across all merchants
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const product = typeof item === 'object' ? item : null;
          if (!product) return null;

          const isOutOfStock = product.stock <= 0;
          const sellingPrice = calculateDiscountedPrice(product.price, product.discount);

          return (
            <div
              key={product._id}
              className="group bg-white rounded-3xl border border-slate-200/80 hover:border-brand-300 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Image */}
                <Link to={`/products/${product._id}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product._id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 text-rose-600 hover:bg-white rounded-2xl shadow-sm transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                <div className="p-4 sm:p-5">
                  <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-brand-600 transition mt-1 mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} size="xs" />

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      {formatCurrency(sellingPrice)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <StockBadge stock={product.stock} />
                  </div>
                </div>
              </div>

              {/* Move to Cart Action */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  onClick={() => moveToCart(product._id)}
                  disabled={isOutOfStock}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
