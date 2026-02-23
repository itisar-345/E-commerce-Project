import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star, Loader2, LogIn, Search } from 'lucide-react';
import { productAPI } from '../services/api';
import type { Product } from '../types/index';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PublicProductListProps {
  searchQuery?: string;
  onLoginRequired: () => void;
  onViewProduct?: (productId: number) => void;
}

const PublicProductList: React.FC<PublicProductListProps> = ({ searchQuery = '', onLoginRequired, onViewProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.pid} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => onViewProduct?.(product.pid)}>
          <div className="relative overflow-hidden">
            <img 
              src={`http://localhost:8080${product.imgpath}`} 
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.stock === 0 && (
              <div className="absolute top-2 left-2">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
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
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">₹{product.price}</span>
                <span className="text-xs text-muted-foreground ml-1">incl. tax</span>
              </div>
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoginRequired();
                }}
                className="flex items-center space-x-1"
              >
                <LogIn className="h-4 w-4" />
                <span>Login to Buy</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PublicProductList;
