import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },

  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  getHighlights: async () => {
    const res = await api.get('/products/highlights');
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

  getSellerStore: async (sellerId) => {
    const res = await api.get(`/products/seller/${sellerId}`);
    return res.data;
  },

  // Seller CRUD
  createProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  uploadImage: async (formData) => {
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  }
};
