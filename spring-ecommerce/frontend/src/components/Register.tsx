import React, { useState } from 'react';
import { ShoppingBag, User, Mail, Lock, Loader2, UserCheck, Store } from 'lucide-react';
import { authAPI } from '../services/api';
import type { RegisterRequest } from '../types/index';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RegisterProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    usertype: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register(formData);
      if (response.success) {
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
        successDiv.textContent = 'Registration successful! Please login.';
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 3000);
        
        onRegister();
        onSwitchToLogin();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-100 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <ShoppingBag className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Join PeachyShop</h1>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, usertype: 'CUSTOMER'})}
                    className={`p-3 border rounded-md flex flex-col items-center space-y-2 transition-colors ${
                      formData.usertype === 'CUSTOMER'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <UserCheck className="h-5 w-5" />
                    <span className="text-sm font-medium">Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, usertype: 'VENDOR'})}
                    className={`p-3 border rounded-md flex flex-col items-center space-y-2 transition-colors ${
                      formData.usertype === 'VENDOR'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Store className="h-5 w-5" />
                    <span className="text-sm font-medium">Vendor</span>
                  </button>
                </div>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;