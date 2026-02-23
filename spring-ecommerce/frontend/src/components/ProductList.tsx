import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star, Loader2, Heart, Search } from 'lucide-react';
import { productAPI, wishlistAPI } from '../services/api';
import type { Product } from '../types/index';
import api from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ProductListProps {
  searchQuery?: string;
  onViewProduct?: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ searchQuery = '', onViewProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.detail.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const loadWishlist = async () => {
    try {
      const response = await wishlistAPI.getAll();
      if (response.success && response.data) {
        setWishlistItems(response.data.map(item => item.product.pid));
      }
    } catch (err) {
      console.error('Failed to load wishlist');
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      if (response.success && response.data) {
        const productData = response.data.content || response.data;
        setProducts(Array.isArray(productData) ? productData : []);
      }
    } catch (err: any) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, size?: string) => {
    setAddingToCart(productId);
    try {
      const params = new URLSearchParams();
      params.append('quantity', quantity.toString());
      if (size) params.append('size', size);
      
      await api.post(`/cart/add/${productId}?${params.toString()}`);
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Product added to cart!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (err) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      errorDiv.textContent = 'Failed to add to cart. Please login first.';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const toggleWishlist = async (product: Product) => {
    const isWishlisted = wishlistItems.includes(product.pid);
    
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(product.pid);
        setWishlistItems(prev => prev.filter(id => id !== product.pid));
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
        successDiv.textContent = 'Removed from wishlist!';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 2000);
      } else {
        await wishlistAPI.add(product.pid);
        setWishlistItems(prev => [...prev, product.pid]);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
        successDiv.textContent = 'Added to wishlist!';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 2000);
      }
    } catch (err) {
      console.error('Wishlist operation failed:', err);
    }
  };

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

  if (filteredProducts.length === 0 && searchQuery.trim() !== '') {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">Try searching with different keywords</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
      {filteredProducts.map((product) => (
        <Card key={product.pid} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm cursor-pointer" onClick={() => onViewProduct?.(product.pid)}>
          <div className="relative overflow-hidden">
            <img 
              src={`http://localhost:8080${product.imgpath}`} 
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.stock === 0 && (
              <div className="absolute top-2 left-2">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Out of Stock
                </span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className={`rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white ${
                  wishlistItems.includes(product.pid) 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${wishlistItems.includes(product.pid) ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-3 sm:p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${
                      i < Math.round(product.averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`} 
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {product.averageRating ? `(${product.averageRating.toFixed(1)})` : '(No reviews)'}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.detail}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <span className="text-base sm:text-lg font-bold text-primary">₹{product.price}</span>
                <span className="text-xs text-muted-foreground ml-1">incl. tax</span>
              </div>
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product.pid);
                }}
                disabled={addingToCart === product.pid || product.stock === 0}
                className="flex items-center space-x-1 bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                {addingToCart === product.pid ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                <span>{product.stock === 0 ? 'Out of Stock' : addingToCart === product.pid ? 'Adding...' : 'Add'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
