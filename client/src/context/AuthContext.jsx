import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('demo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('demo_token') || null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Validate and refresh profile from server if token exists
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('demo_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('demo_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Session verification failed:', err.message);
      // If token expired or invalid
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      if (res.success && res.token && res.user) {
        localStorage.setItem('demo_token', res.token);
        localStorage.setItem('demo_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.token && res.user) {
        localStorage.setItem('demo_token', res.token);
        localStorage.setItem('demo_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        toast.success(`Account created successfully! Welcome, ${res.user.name}.`);
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Invalid registration response' };
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('demo_token');
    localStorage.removeItem('demo_user');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('demo_user', JSON.stringify(res.user));
        toast.success('Profile updated successfully');
        return { success: true, user: res.user };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      return { success: false, message: err.message };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await authService.addAddress(addressData);
      if (res.success && res.addresses) {
        setUser(prev => ({ ...prev, addresses: res.addresses }));
        localStorage.setItem('demo_user', JSON.stringify({ ...user, addresses: res.addresses }));
        toast.success('Address saved');
        return { success: true, addresses: res.addresses };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add address');
      return { success: false, message: err.message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await authService.deleteAddress(addressId);
      if (res.success && res.addresses) {
        setUser(prev => ({ ...prev, addresses: res.addresses }));
        localStorage.setItem('demo_user', JSON.stringify({ ...user, addresses: res.addresses }));
        toast.success('Address deleted');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
      return { success: false };
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const res = await authService.setDefaultAddress(addressId);
      if (res.success && res.addresses) {
        setUser(prev => ({ ...prev, addresses: res.addresses }));
        localStorage.setItem('demo_user', JSON.stringify({ ...user, addresses: res.addresses }));
        toast.success('Default address updated');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to set default address');
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isBuyer: user?.role === 'buyer',
    isSeller: user?.role === 'seller',
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
