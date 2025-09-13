import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, User, Calendar, DollarSign, Loader2, Edit3, TrendingUp } from 'lucide-react';
import type { Order } from '../types/index';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DELIVERED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    loadVendorOrders();
  }, []);

  const loadVendorOrders = async () => {
    try {
      console.log('Loading vendor orders...');
      const response = await api.get('/orders/vendor');
      console.log('Vendor orders response:', response.data);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status?status=${status}`);
      loadVendorOrders();
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Order status updated successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (err) {
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      errorDiv.textContent = 'Failed to update order status';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'ALL' || order.status === filter
  );

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    revenue: orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.price, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading customer orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Customer Orders</h1>
          </div>
          <p className="text-muted-foreground">Manage and fulfill customer orders for your products</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('ALL')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-bold text-foreground">{orderStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('PENDING')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold text-foreground">{orderStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('DELIVERED')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-xl font-bold text-foreground">{orderStats.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('CANCELLED')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <p className="text-xl font-bold text-foreground">{orderStats.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold text-foreground">₹{orderStats.revenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          {['ALL', 'PENDING', 'DELIVERED', 'CANCELLED'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status as any)}
            >
              {status === 'ALL' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {filter === 'ALL' ? 'No customer orders yet' : `No ${filter.toLowerCase()} orders`}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'ALL' ? 'Orders will appear here when customers purchase your products.' : `You don't have any ${filter.toLowerCase()} orders.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={`http://localhost:8080${order.product.imgpath}`} 
                          alt={order.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {order.product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Customer: {order.user.username}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Order #{order.id}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>₹{order.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <select 
                            value={order.status} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className="appearance-none bg-white border-2 border-primary/20 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm hover:border-primary/40 transition-all duration-200 cursor-pointer"
                          >
                            <option value="PENDING">📋 Mark as Pending</option>
                            <option value="DELIVERED">✅ Mark as Delivered</option>
                            <option value="CANCELLED">❌ Mark as Cancelled</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {updating === order.id && (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;