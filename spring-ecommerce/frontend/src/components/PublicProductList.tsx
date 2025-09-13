import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star, Loader2, LogIn } from 'lucide-react';
import { productAPI } from '../services/api';
import type { Product } from '../types/index';
import ProductDetails from './ProductDetails';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PublicProductListProps {
  onLoginRequired: () => void;
}

const PublicProductList: React.FC<PublicProductListProps> = ({ onLoginRequired }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

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

  if (selectedProductId) {
    return (
      <ProductDetails 
        productId={selectedProductId} 
        onBack={() => setSelectedProductId(null)}
        isPublic={true}
        onLoginRequired={onLoginRequired}
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.pid} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="relative overflow-hidden">
            <img 
              src={`http://localhost:8080${product.imgpath}`} 
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedProductId(product.pid)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedProductId(product.pid)}
                className="bg-white/90 hover:bg-white"
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
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
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
                onClick={onLoginRequired}
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