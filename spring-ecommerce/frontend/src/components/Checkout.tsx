import React, { useState } from 'react';
import { CreditCard, Phone, MapPin, Truck, Loader2, X, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CheckoutProps {
  onOrderPlaced: () => void;
  onCancel: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onOrderPlaced, onCancel }) => {
  const [formData, setFormData] = useState({
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/orders/place', formData);
      if (response.data.success) {
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center space-x-2';
        successDiv.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg><span>Order placed successfully!</span>';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 3000);
        onOrderPlaced();
      }
    } catch (err) {
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
      errorDiv.textContent = 'Failed to place order';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <CreditCard className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Checkout Details</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Phone Number</span>
              </label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="pl-4"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Delivery Address</span>
              </label>
              <textarea
                placeholder="Enter your complete delivery address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                rows={3}
                required
              />
            </div>

            {/* Payment Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Cash on Delivery</h3>
                  <p className="text-sm text-green-600">Pay when your order arrives</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;