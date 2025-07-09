
import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://test.freedomprocessing3.com/public/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Store Details API
export const storeApi = {
  getStore: () => api.get('/store'),
  updateStore: (data: any) => api.put('/store', data),
};

// Dashboard Analytics API
export const analyticsApi = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getChartData: () => api.get('/analytics/charts'),
  getRecentActivity: () => api.get('/analytics/recent-activity'),
  getActiveCampaigns: () => api.get('/analytics/active-campaigns'),
};

// Customers API
export const customersApi = {
  getAll: (params?: any) => api.get('/customers', { params }),
  getById: (id: number) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
  search: (query: string) => api.get(`/customers/search?q=${query}`),
};

// Points API
export const pointsApi = {
  earn: (data: any) => api.post('/points/earn', data),
  redeem: (data: any) => api.post('/points/redeem', data),
  deduct: (data: any) => api.post('/points/deduct', data),
  searchCustomer: (phone: string) => api.get(`/points/search-customer?phone=${phone}`),
    previewPoints: (amount: number) => api.post('/points/preview', { amount }),
  redeemPreview: (data: any) => api.post('/points/redeem-preview', data),


};

// Campaigns API
export const campaignApi = {
  getAll: () => api.get('/campaigns'),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: number, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: number) => api.delete(`/campaigns/${id}`),
};

// Transactions API
export const transactionsApi = {
  getAll: (params?: any) => api.get('/transactions', { params }),
  delete: (id: number) => api.delete(`/transactions/${id}`),
};

// Admin API
export const adminApi = {
  login: (credentials: any) => api.post('/admin/login', credentials),
  updateCredentials: (data: any) => api.put('/admin/credentials', data),
  getAdmins: () => api.get('/admin/users'),
  createAdmin: (data: any) => api.post('/admin/users', data),
  deleteAdmin: (id: number) => api.delete(`/admin/users/${id}`),
};

// Customer Portal API
export const customerPortalApi = {
  register: (data: any) => api.post('/customer/register', data),
  login: (credentials: any) => api.post('/customer/login', credentials),
  getProfile: (token: string) => api.get('/customer/profile', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  requestRedemption: (data: any, token: string) => api.post('/customer/redeem-request', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

export default api;
