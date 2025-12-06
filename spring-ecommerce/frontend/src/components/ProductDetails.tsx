import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, Heart, Truck, Shield, RotateCcw, Loader2, LogIn, Plus, Minus, Edit2, X } from 'lucide-react';
import type { Product } from '../types/index';
import { productAPI, wishlistAPI } from '../services/api';
import api from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ProductDetailsProps {
  productId: number;
  onBack: () => void;
  isPublic?: boolean;
  onLoginRequired?: () => void;
  isVendor?: boolean;
  onProductDeleted?: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onBack, isPublic = false, onLoginRequired, isVendor = false, onProductDeleted }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', price: '', detail: '', image: null as File | null });
  const [deleting, setDeleting] = useState(false);
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    loadProduct();
    if (!isVendor) {
      checkWishlistStatus();
    }
  }, [productId]);

  const checkWishlistStatus = async () => {
    if (isPublic) return;
    try {
      const response = await wishlistAPI.check(productId);
      if (response.success && response.data !== undefined) {
        setIsWishlisted(response.data);
      }
    } catch (err) {
      console.error('Failed to check wishlist status');
    }
  };

  const loadProduct = async () => {
    try {
      const response = await productAPI.getById(productId);
      if (response.success && response.data) {
        setProduct(response.data);
        setEditData({
          name: response.data.name,
          price: response.data.price.toString(),
          detail: response.data.detail,
          image: null
        });
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
      const params = new URLSearchParams();
      params.append('quantity', quantity.toString());
      params.append('size', selectedSize);
      
      await api.post(`/cart/add/${productId}?${params.toString()}`);
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center space-x-2';
      successDiv.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg><span>Added to cart!</span>';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (err) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      errorDiv.textContent = 'Failed to add to cart. Please login first.';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (isPublic && onLoginRequired) {
      onLoginRequired();
      return;
    }
    
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(productId);
        setIsWishlisted(false);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
        successDiv.textContent = 'Removed from wishlist!';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 2000);
      } else {
        await wishlistAPI.add(productId);
        setIsWishlisted(true);
        
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-4 sm:mb-6 flex items-center space-x-2 hover:bg-white/50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
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
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-primary">₹{product.price}</span>
                <span className="text-base sm:text-lg text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                  {Math.round(((product.price * 1.2 - product.price) / (product.price * 1.2)) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.detail}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            {!isVendor && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center p-2 sm:p-4 bg-white/50 rounded-lg">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-foreground">Free Delivery</p>
                <p className="text-xs text-muted-foreground hidden sm:block">On orders above ₹500</p>
              </div>
              <div className="text-center p-2 sm:p-4 bg-white/50 rounded-lg">
                <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-foreground">Easy Returns</p>
                <p className="text-xs text-muted-foreground hidden sm:block">7 days return policy</p>
              </div>
              <div className="text-center p-2 sm:p-4 bg-white/50 rounded-lg">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-foreground">Secure Payment</p>
                <p className="text-xs text-muted-foreground hidden sm:block">100% secure checkout</p>
              </div>
            </div>
            )}

            {/* Size Selector */}
            {!isVendor && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            )}
            
            {/* Quantity Selector */}
            {!isVendor && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            )}

            {/* Action Buttons */}
            {isVendor ? (
              <div className="space-y-4">
                {isEditing ? (
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-semibold text-foreground mb-4">Edit Product</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Product Name</label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full mt-1 p-2 border border-border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Price</label>
                          <input
                            type="number"
                            value={editData.price}
                            onChange={(e) => setEditData({...editData, price: e.target.value})}
                            className="w-full mt-1 p-2 border border-border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <textarea
                            value={editData.detail}
                            onChange={(e) => setEditData({...editData, detail: e.target.value})}
                            className="w-full mt-1 p-2 border border-border rounded-md"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Change Image (Optional)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditData({...editData, image: e.target.files?.[0] || null})}
                            className="w-full mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              try {
                                const formData = new FormData();
                                formData.append('name', editData.name);
                                formData.append('price', editData.price);
                                formData.append('detail', editData.detail);
                                if (editData.image) formData.append('image', editData.image);
                                
                                await productAPI.update(productId, formData);
                                setIsEditing(false);
                                loadProduct();
                                
                                const successDiv = document.createElement('div');
                                successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
                                successDiv.textContent = 'Product updated successfully!';
                                document.body.appendChild(successDiv);
                                setTimeout(() => document.body.removeChild(successDiv), 2000);
                              } catch (err) {
                                console.error('Failed to update product');
                              }
                            }}
                            className="flex-1"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <Edit2 className="mr-2 h-5 w-5" />
                      Edit Product
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (window.confirm('Mark this product as out of stock? This will delete the product.')) {
                          setDeleting(true);
                          try {
                            await productAPI.delete(productId);
                            const successDiv = document.createElement('div');
                            successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
                            successDiv.textContent = 'Product marked as out of stock!';
                            document.body.appendChild(successDiv);
                            setTimeout(() => document.body.removeChild(successDiv), 2000);
                            onProductDeleted?.();
                            onBack();
                          } catch (err) {
                            console.error('Failed to delete product');
                          } finally {
                            setDeleting(false);
                          }
                        }
                      }}
                      disabled={deleting}
                      className="flex-1"
                    >
                      {deleting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <X className="mr-2 h-5 w-5" />
                      )}
                      Out of Stock
                    </Button>
                  </div>
                )}
              </div>
            ) : (
            <div className="flex space-x-3 sm:space-x-4">
              <Button 
                onClick={addToCart} 
                disabled={addingToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 sm:py-3 text-base sm:text-lg"
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
                className={`px-4 sm:px-6 ${isWishlisted ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'hover:bg-pink-50 hover:border-pink-200'}`}
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;