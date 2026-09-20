import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isBuyer } = useAuth();
  const toast = useToast();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isBuyer) {
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        total: 0,
        itemCount: 0
      });
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      console.error('Failed to load cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isBuyer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.info('Please log in as a buyer to add items to your cart.');
      return { success: false, requireAuth: true };
    }

    if (!isBuyer) {
      toast.warning('Sellers cannot add items to cart. Please use a buyer account.');
      return { success: false };
    }

    try {
      setLoading(true);
      const res = await cartService.addToCart(productId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
        toast.success(res.message || 'Added to cart!');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const res = await cartService.updateQuantity(itemId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const res = await cartService.removeItem(itemId);
      if (res.success && res.cart) {
        setCart(res.cart);
        toast.info('Item removed from cart');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartService.clearCart();
      if (res.success) {
        setCart({
          items: [],
          subtotal: 0,
          discount: 0,
          deliveryFee: 0,
          total: 0,
          itemCount: 0
        });
      }
    } catch (err) {
      console.error('Failed to clear cart:', err.message);
    }
  };

  const value = {
    cart,
    loading,
    itemCount: cart.itemCount || 0,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
