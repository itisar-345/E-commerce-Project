import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, Heart, Truck, Shield, RotateCcw, Loader2, LogIn } from 'lucide-react';
import type { Product } from '../types/index';
import { productAPI } from '../services/api';
import api from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ProductDetailsProps {
  productId: number;
  onBack: () => void;
  isPublic?: boolean;
  onLoginRequired?: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onBack, isPublic = false, onLoginRequired }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    loadProduct();
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      setIsWishlisted(wishlist.some((item: Product) => item.pid === productId));
    }
  };

  const loadProduct = async () => {
    try {
      const response = await productAPI.getById(productId);
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (err) {
      console.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (isPublic && onLoginRequired) {
      onLoginRequired();
      return;
    }
    setAddingToCart(true);
    try {
      await api.post(`/cart/add/${productId}`);
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center space-x-2';
      successDiv.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg><span>Added to cart!</span>';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (err) {
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      errorDiv.textContent = 'Failed to add to cart. Please login first.';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    if (isPublic && onLoginRequired) {
      onLoginRequired();
      return;
    }
    
    const savedWishlist = localStorage.getItem('wishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    if (isWishlisted) {
      wishlist = wishlist.filter((item: Product) => item.pid !== productId);
      setIsWishlisted(false);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Removed from wishlist!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 2000);
    } else {
      if (product) {
        wishlist.push(product);
        setIsWishlisted(true);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
        successDiv.textContent = 'Added to wishlist!';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 2000);
      }
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-2">Product not found</h3>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-6 flex items-center space-x-2 hover:bg-white/50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square">
                <img 
                  src={`http://localhost:8080${product.imgpath}`} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                <span className="text-lg text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                  {Math.round(((product.price * 1.2 - product.price) / (product.price * 1.2)) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.detail}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On orders above ₹500</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7 days return policy</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% secure checkout</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={addToCart} 
                disabled={addingToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : isPublic ? (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Login to Buy
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className={`px-6 ${isWishlisted ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'hover:bg-pink-50 hover:border-pink-200'}`}
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;