import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star, Loader2, Heart } from 'lucide-react';
import { productAPI } from '../services/api';
import type { Product } from '../types/index';
import api from '../services/api';
import ProductDetails from './ProductDetails';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      setWishlistItems(wishlist.map((item: Product) => item.pid));
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err: any) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number) => {
    setAddingToCart(productId);
    try {
      await api.post(`/cart/add/${productId}`);
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Product added to cart!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (err) {
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      errorDiv.textContent = 'Failed to add to cart. Please login first.';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const toggleWishlist = (product: Product) => {
    const savedWishlist = localStorage.getItem('wishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    const isWishlisted = wishlistItems.includes(product.pid);
    
    if (isWishlisted) {
      wishlist = wishlist.filter((item: Product) => item.pid !== product.pid);
      setWishlistItems(prev => prev.filter(id => id !== product.pid));
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Removed from wishlist!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 2000);
    } else {
      wishlist.push(product);
      setWishlistItems(prev => [...prev, product.pid]);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Added to wishlist!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 2000);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  if (selectedProductId) {
    return (
      <ProductDetails 
        productId={selectedProductId} 
        onBack={() => setSelectedProductId(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Products Available</h3>
          <p className="text-muted-foreground">Check back later for new arrivals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.pid} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
          <div className="relative overflow-hidden">
            <img 
              src={`http://localhost:8080${product.imgpath}`} 
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedProductId(product.pid)}
            />
            <div className="absolute top-2 right-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => toggleWishlist(product)}
                className={`rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white ${
                  wishlistItems.includes(product.pid) 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${wishlistItems.includes(product.pid) ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedProductId(product.pid)}
                className="bg-white/90 hover:bg-white backdrop-blur-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="mb-2">
              <h3 
                className="font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setSelectedProductId(product.pid)}
              >
                {product.name}
              </h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-primary/60 text-primary/60" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.detail}
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">₹{product.price}</span>
                <span className="text-xs text-muted-foreground ml-1">incl. tax</span>
              </div>
              
              <Button
                size="sm"
                onClick={() => addToCart(product.pid)}
                disabled={addingToCart === product.pid}
                className="flex items-center space-x-1 bg-primary hover:bg-primary/90"
              >
                {addingToCart === product.pid ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                <span>{addingToCart === product.pid ? 'Adding...' : 'Add'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;