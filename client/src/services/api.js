import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('demo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    // If unauthorized, token may be expired
    if (error.response?.status === 401 && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      localStorage.removeItem('demo_token');
      localStorage.removeItem('demo_user');
      // Optionally redirect if on protected route
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
