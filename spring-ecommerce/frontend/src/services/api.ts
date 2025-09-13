import axios from 'axios';
import type { ApiResponse, LoginRequest, RegisterRequest, Product } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data: LoginRequest): Promise<ApiResponse<string>> =>
    api.post('/auth/login', data).then((res) => res.data),
  
  register: (data: RegisterRequest): Promise<ApiResponse<string>> =>
    api.post('/auth/register', data).then((res) => res.data),
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
  
  delete: (id: number): Promise<ApiResponse<string>> =>
    api.delete(`/products/${id}`).then((res) => res.data),
};

export default api;