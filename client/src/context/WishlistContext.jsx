import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isBuyer } = useAuth();
  const { refreshCart } = useCart();
  const toast = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !isBuyer) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success && res.wishlist) {
        setWishlist(res.wishlist);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isBuyer]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(item => {
      const id = typeof item === 'object' ? item._id : item;
      return id === productId;
    });
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.info('Please log in as a buyer to save items to your wishlist.');
      return { success: false, requireAuth: true };
    }

    if (!isBuyer) {
      toast.warning('Wishlist is only available for buyer accounts.');
      return { success: false };
    }

    const productId = typeof product === 'object' ? product._id : product;
    const exists = isInWishlist(productId);

    try {
      if (exists) {
        await wishlistService.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(p => (typeof p === 'object' ? p._id : p) !== productId));
        toast.info('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(productId);
        if (typeof product === 'object') {
          setWishlist(prev => [...prev, product]);
        } else {
          fetchWishlist();
        }
        toast.success('Saved to wishlist!');
      }
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update wishlist');
      return { success: false };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(p => (typeof p === 'object' ? p._id : p) !== productId));
      toast.info('Item removed from wishlist');
    } catch (err) {
      toast.error(err.message || 'Failed to remove from wishlist');
    }
  };

  const moveToCart = async (productId) => {
    try {
      await wishlistService.moveToCart(productId);
      setWishlist(prev => prev.filter(p => (typeof p === 'object' ? p._id : p) !== productId));
      await refreshCart();
      toast.success('Moved item to shopping cart!');
    } catch (err) {
      toast.error(err.message || 'Failed to move to cart');
    }
  };

  const value = {
    wishlist,
    loading,
    itemCount: wishlist.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    moveToCart,
    refreshWishlist: fetchWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
