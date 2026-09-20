import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },

  addAddress: async (addressData) => {
    const res = await api.post('/auth/addresses', addressData);
    return res.data;
  },

  deleteAddress: async (addressId) => {
    const res = await api.delete(`/auth/addresses/${addressId}`);
    return res.data;
  },

  setDefaultAddress: async (addressId) => {
    const res = await api.put(`/auth/addresses/${addressId}/default`);
    return res.data;
  }
};
