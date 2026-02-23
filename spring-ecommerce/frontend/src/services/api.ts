import axios from 'axios';
import type { ApiResponse, LoginRequest, RegisterRequest, Product, Wishlist, Review } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, 
            JSON.stringify(refreshToken),
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
          
          if (response.data.success && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: LoginRequest): Promise<ApiResponse<{accessToken: string, refreshToken: string}>> =>
    api.post('/auth/login', data).then((res) => res.data),
  
  register: (data: RegisterRequest): Promise<ApiResponse<string>> =>
    api.post('/auth/register', data).then((res) => res.data),
};

export const wishlistAPI = {
  getAll: (): Promise<ApiResponse<Wishlist[]>> =>
    api.get('/wishlist').then((res) => res.data),
  
  add: (productId: number): Promise<ApiResponse<Wishlist>> =>
    api.post(`/wishlist/add/${productId}`).then((res) => res.data),
  
  remove: (productId: number): Promise<ApiResponse<string>> =>
    api.delete(`/wishlist/remove/${productId}`).then((res) => res.data),
  
  check: (productId: number): Promise<ApiResponse<boolean>> =>
    api.get(`/wishlist/check/${productId}`).then((res) => res.data),
};

export const reviewAPI = {
  getProductReviews: (productId: number): Promise<ApiResponse<Review[]>> =>
    axios.get(`${API_BASE_URL}/reviews/product/${productId}`).then((res) => res.data),
  
  addReview: (productId: number, rating: number, comment?: string): Promise<ApiResponse<Review>> =>
    api.post(`/reviews/product/${productId}`, null, {
      params: { rating, comment }
    }).then((res) => res.data),
  
  canReview: (productId: number): Promise<ApiResponse<boolean>> =>
    api.get(`/reviews/can-review/${productId}`).then((res) => res.data),
};

export const productAPI = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      console.log('Products API Response:', res.data);
      if (res.data.success) {
        return res.data;
      } else {
        return { success: true, message: 'Success', data: res.data.data || res.data || [] };
      }
    } catch (error) {
      console.error('Products API Error:', error);
      return { success: false, message: 'Failed to load products', data: [] };
    }
  },
  
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      if (res.data.success) {
        return res.data;
      } else {
        return { success: true, message: 'Success', data: res.data.data || res.data };
      }
    } catch (error) {
      return { success: false, message: 'Product not found', data: null };
    }
  },
  
  create: (formData: FormData): Promise<ApiResponse<Product>> =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data),
  
  update: (id: number, formData: FormData): Promise<ApiResponse<Product>> =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data),
};

export default api;