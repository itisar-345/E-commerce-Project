import React, { useState, useEffect } from 'react';
import { Plus, Package, TrendingUp, DollarSign, X, Upload, Trash2, Store } from 'lucide-react';
import { productAPI } from '../services/api';
import api from '../services/api';
import type { Product } from '../types/index';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

const VendorDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    detail: '',
    image: null as File | null
  });

  useEffect(() => {
    loadVendorProducts();
    loadVendorOrders();
  }, []);

  const loadVendorProducts = async () => {
    try {
      const response = await api.get('/products/vendor');
      console.log('Vendor products response:', response.data);
      if (response.data.success && response.data.data) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load vendor products:', err);
    }
  };

  const loadVendorOrders = async () => {
    try {
      const response = await api.get('/orders/vendor');
      console.log('Vendor orders response:', response.data);
      if (response.data.success && response.data.data) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load vendor orders:', err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return;
    
    setLoading(true);
    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('price', formData.price);
    uploadData.append('detail', formData.detail);
    uploadData.append('image', formData.image);

    try {
      await productAPI.create(uploadData);
      setShowUploadForm(false);
      setFormData({ name: '', price: '', detail: '', image: null });
      loadVendorProducts();
      loadVendorOrders();
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        loadVendorProducts();
      } catch (err) {
        console.error('Delete failed');
      }
    }
  };

  const renderUploadForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-primary" />
            <span>Add New Product</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowUploadForm(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <Input
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full p-3 border border-input rounded-md resize-none"
                rows={3}
                placeholder="Describe your product"
                value={formData.detail}
                onChange={(e) => setFormData({...formData, detail: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                required
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-peach-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <Store className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vendor Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your products, track sales, and grow your business.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-full">
                  <Package className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.filter(order => order.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{orders.filter(order => order.status === 'DELIVERED').reduce((sum, order) => sum + order.price, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>My Products</span>
            </CardTitle>
            <Button onClick={() => setShowUploadForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first product to the store</p>
                <Button onClick={() => setShowUploadForm(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Product</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.pid} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={`http://localhost:8080${product.imgpath}`} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-lg font-bold text-primary mb-2">₹{product.price}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.detail}</p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(product.pid)}
                        className="w-full flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showUploadForm && renderUploadForm()}
    </div>
  );
};

export default VendorDashboard;