import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';

interface CustomerDashboardProps {
  searchQuery?: string;
  onViewDetails?: () => void;
  onBackFromDetails?: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ searchQuery = '', onViewDetails, onBackFromDetails }) => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  const handleViewProduct = (productId: number) => {
    setSelectedProductId(productId);
    onViewDetails?.();
  };
  
  const handleBack = () => {
    setSelectedProductId(null);
    onBackFromDetails?.();
  };
  
  if (selectedProductId) {
    return <ProductDetails productId={selectedProductId} onBack={handleBack} />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-100 to-peach-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Welcome Back!</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Personal
              <span className="text-primary block">Shopping Experience</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Discover, shop, and enjoy premium products tailored just for you.
            </p>
            
          </div>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-3">Shop Our Collection</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Add your favorite items to cart and enjoy seamless shopping experience.
          </p>
        </div>
        <ProductList searchQuery={searchQuery} onViewProduct={handleViewProduct} />
      </div>
    </div>
  );
};

export default CustomerDashboard;