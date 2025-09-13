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
}

export interface Cart {
  id: number;
  user: User;
  product: Product;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  user: User;
  product: Product;
  price: number;
  orderDate: string;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
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