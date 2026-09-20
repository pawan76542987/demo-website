import api from './api';

export const sellerService = {
  getDashboardStats: async () => {
    const res = await api.get('/seller/dashboard');
    return res.data;
  },

  getSellerProducts: async (params = {}) => {
    const res = await api.get('/seller/products', { params });
    return res.data;
  },

  getSellerOrders: async (params = {}) => {
    const res = await api.get('/seller/orders', { params });
    return res.data;
  },

  updateOrderStatus: async (orderId, data) => {
    const res = await api.put(`/seller/orders/${orderId}/status`, data);
    return res.data;
  },

  updateQuickStock: async (productId, stock) => {
    const res = await api.put(`/seller/inventory/${productId}`, { stock });
    return res.data;
  }
};
