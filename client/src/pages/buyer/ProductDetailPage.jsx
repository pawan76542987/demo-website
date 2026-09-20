import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, calculateDiscountedPrice } from '../../utils/formatters';
import { StarRating } from '../../components/common/StarRating';
import { DiscountBadge, StockBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ProductCard } from '../../components/buyer/ProductCard';
import { ReviewModal } from '../../components/buyer/ReviewModal';
import {
  ShoppingBag,
  Zap,
  Heart,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquarePlus,
  CheckCircle2
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewsData, setReviewsData] = useState({ reviews: [], ratingDistribution: {} });
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, isBuyer } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [prodRes, revRes] = await Promise.all([
        productService.getProductById(id),
        reviewService.getProductReviews(id)
      ]);

      if (prodRes.success) {
        setProduct(prodRes.product);
        setRelatedProducts(prodRes.relatedProducts || []);
        if (prodRes.product.images && prodRes.product.images.length > 0) {
          setActiveImage(prodRes.product.images[0]);
        }
      }
      if (revRes.success) {
        setReviewsData(revRes);
      }
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The product you are looking for may have been removed or is unavailable.</p>
        <Link to="/products" className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const sellingPrice = calculateDiscountedPrice(product.price, product.discount);
  const savings = product.price - sellingPrice;

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    if (newQty > product.stock) {
      toast.warning(`Maximum available stock is ${product.stock}`);
      return;
    }
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;
    setAdding(true);
    const res = await addToCart(product._id, quantity);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    if (!isAuthenticated) {
      toast.info('Please log in as a buyer to proceed to checkout.');
      navigate('/login?redirect=/checkout');
      return;
    }
    if (!isBuyer) {
      toast.warning('Sellers cannot purchase products. Please use a buyer account.');
      return;
    }
    await addToCart(product._id, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-brand-600 transition">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600 transition">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-subtle mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left: Images Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[480px] no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 bg-slate-100 ${
                      activeImage === img ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Active Big Image */}
            <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={activeImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Wishlist Button Overlay */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition shadow-md ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-white/85 text-slate-600 hover:text-rose-600 hover:bg-white border border-white/60'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & SKU */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-xl">
                  {product.brand}
                </span>
                {product.sku && (
                  <span className="text-xs font-mono text-slate-400">SKU: {product.sku}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Merchant Guarantee
                </span>
              </div>

              {/* Price Block */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {formatCurrency(sellingPrice)}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-slate-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                      <DiscountBadge discount={product.discount} />
                    </>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-xs font-bold text-emerald-600 mt-1">
                    You save {formatCurrency(savings)} ({product.discount}% discount)
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-0.5">Inclusive of all local taxes & duties</p>
              </div>

              {/* Stock Status & Quantity Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <StockBadge stock={product.stock} />

                {!isOutOfStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-slate-200 disabled:opacity-40 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-slate-200 disabled:opacity-40 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || adding}
                  className="flex-1 py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm transition shadow-md hover:shadow-elevation flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{adding ? 'Adding to Cart...' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition shadow-md flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5 text-accent-400" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Seller Info Card */}
            {product.sellerId && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Sold & Fulfilled by:</p>
                    <Link
                      to={`/store/${product.sellerId._id}`}
                      className="font-bold text-xs sm:text-sm text-slate-900 hover:text-brand-600 transition"
                    >
                      {product.sellerId.storeInfo?.storeName || product.sellerId.name}
                    </Link>
                  </div>
                </div>
                <Link
                  to={`/store/${product.sellerId._id}`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
                >
                  Visit Store →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Product Description & Specifications */}
        <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About this product</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Technical Specifications
              </h4>
              <dl className="divide-y divide-slate-200/60 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="py-2.5 flex justify-between gap-4">
                    <dt className="font-semibold text-slate-500">{spec.key}</dt>
                    <dd className="font-bold text-slate-900 text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-subtle mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Customer Reviews & Ratings
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Feedback from verified purchasers of this item on DEMO
            </p>
          </div>

          <button
            type="button"
            onClick={() => setReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        {reviewsData.reviews.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No customer reviews yet. Be the first verified buyer to review!
          </div>
        ) : (
          <div className="space-y-6">
            {reviewsData.reviews.map((rev) => (
              <div key={rev._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                      {rev.buyerName?.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{rev.buyerName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarRating rating={rev.rating} showCount={false} size="xs" />
                </div>
                {rev.title && <h4 className="text-xs font-extrabold text-slate-900">{rev.title}</h4>}
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="mb-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Similar items you might like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        product={product}
        onReviewSubmitted={fetchProductDetails}
      />
    </div>
  );
};
