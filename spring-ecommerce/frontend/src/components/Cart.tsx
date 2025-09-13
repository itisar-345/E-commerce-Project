import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, CreditCard, Loader2, ShoppingBag } from 'lucide-react';
import type { Cart as CartType } from '../types/index';
import api from '../services/api';
import Checkout from './Checkout';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [removingItem, setRemovingItem] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId: number) => {
    setRemovingItem(cartId);
    try {
      await api.delete(`/cart/${cartId}`);
      loadCart();
    } catch (err) {
      console.error('Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleOrderPlaced = () => {
    setShowCheckout(false);
    loadCart();
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <Checkout 
        onOrderPlaced={handleOrderPlaced}
        onCancel={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-8">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some products to get started!</p>
            <Button onClick={() => window.history.back()}>Continue Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={`http://localhost:8080${item.product.imgpath}`} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.product.detail}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{item.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          Subtotal: ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        disabled={removingItem === item.id}
                        className="flex items-center space-x-1"
                      >
                        {removingItem === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">₹{Math.round(total * 0.18)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{Math.round(total * 1.18)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowCheckout(true)} 
                  className="w-full flex items-center space-x-2"
                  size="lg"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;