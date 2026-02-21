export interface User {
  userid: number;
  username: string;
  email: string;
  usertype: 'CUSTOMER' | 'VENDOR';
}

export interface Product {
  pid: number;
  name: string;
  price: number;
  detail: string;
  imgpath: string;
  vendor?: User;
  sizes?: string;
  stock?: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface Cart {
  id: number;
  user: User;
  product: Product;
  price: number;
  quantity: number;
  size?: string;
}

export interface Order {
  id: number;
  user: User;
  product: Product;
  price: number;
  quantity: number;
  size?: string;
  orderDate: string;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
}

export interface Wishlist {
  id: number;
  user: User;
  product: Product;
  addedAt: string;
}

export interface Review {
  id: number;
  user: User;
  product: Product;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  usertype: 'CUSTOMER' | 'VENDOR';
}