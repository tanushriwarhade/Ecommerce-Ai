import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
};

export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity = 1) => API.post('/cart/add', { productId, quantity }),
  update: (productId, quantity) => API.put('/cart/update', { productId, quantity }),
  remove: (productId) => API.delete(`/cart/remove/${productId}`),
  clear: () => API.delete('/cart/clear'),
};

export const ordersAPI = {
  createRazorpayOrder: (amount) => API.post('/orders/create-razorpay-order', { amount }),
  verifyPayment: (data) => API.post('/orders/verify-payment', data),
  getMyOrders: () => API.get('/orders/my-orders'),
};

export const recommendationsAPI = {
  getForProduct: (productId) => API.get(`/recommendations/${productId}`),
  getPersonalized: () => API.get('/recommendations/user/personalized'),
};

export default API;
