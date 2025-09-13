import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2, Eye, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import ProductDetails from './ProductDetails';
import api from '../services/api';
import type { Product } from '../types/index';

interface WishlistProps {
  onBack: () => void;
  onViewProduct: (productId: number) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onBack, onViewProduct }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      // For now, using localStorage to store wishlist
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (err) {
      console.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId: number) => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const currentWishlist = JSON.parse(savedWishlist);
      const updatedWishlist = currentWishlist.filter((item: Product) => item.pid !== productId);
      setWishlistItems(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Removed from wishlist!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 2000);
    }
  };

  const addToCart = async (productId: number) => {
    setAddingToCart(productId);
    try {
      await api.post(`/cart/add/${productId}`);
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center space-x-2';
      successDiv.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg><span>Added to cart!</span>';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (err) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      errorDiv.textContent = 'Failed to add to cart';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setAddingToCart(null);
    }
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center space-x-3 mb-2">
                <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-full p-2">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <span>My Wishlist</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later ✨
              </p>
            </div>
          </div>
          {wishlistItems.length > 0 && (
            <div className="flex items-center space-x-2">
              {editMode && selectedForDelete.length > 0 && (
                <Button 
                  variant="destructive"
                  onClick={() => {
                    selectedForDelete.forEach(pid => removeFromWishlist(pid));
                    setSelectedForDelete([]);
                    setEditMode(false);
                  }}
                >
                  Delete Selected ({selectedForDelete.length})
                </Button>
              )}
              <Button 
                variant={editMode ? "outline" : "secondary"}
                onClick={() => {
                  setEditMode(!editMode);
                  setSelectedForDelete([]);
                }}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <Card className="text-center py-20 bg-white/70 backdrop-blur-sm border-pink-100">
            <CardContent>
              <div className="bg-gradient-to-br from-pink-100 to-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-pink-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Start adding products you love to your wishlist ❤️
              </p>
              <Button onClick={onBack} className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-3 text-lg">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <Card key={product.pid} className={`group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm ${editMode && selectedForDelete.includes(product.pid) ? 'ring-2 ring-red-500' : ''}`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={`http://localhost:8080${product.imgpath}`} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => !editMode && setSelectedProductId(product.pid)}
                  />
                  {editMode ? (
                    <div className="absolute top-2 right-2">
                      <input 
                        type="checkbox"
                        checked={selectedForDelete.includes(product.pid)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedForDelete(prev => [...prev, product.pid]);
                          } else {
                            setSelectedForDelete(prev => prev.filter(id => id !== product.pid));
                          }
                        }}
                        className="w-5 h-5 text-red-600 bg-white/90 border-gray-300 rounded focus:ring-red-500"
                      />
                    </div>
                  ) : (
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
                  )}
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
        )}
      </div>
    </div>
  );
};

export default Wishlist;