import React from 'react';
import { Sparkles, Heart, Star, ShoppingBag } from 'lucide-react';
import PublicProductList from './PublicProductList';

interface PublicHomepageProps {
  onLoginRequired: () => void;
}

const PublicHomepage: React.FC<PublicHomepageProps> = ({ onLoginRequired }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-100 to-peach-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Collection</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Welcome to
              <span className="text-primary block">PeachyShop</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover amazing products from trusted vendors. Browse our curated collection 
              and find everything you need in one beautiful place.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-pink-100 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground">Shop</h3>
                <p className="text-xs text-muted-foreground">Premium Items</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Star className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground">Quality</h3>
                <p className="text-xs text-muted-foreground">Guaranteed</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Heart className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground">Support</h3>
                <p className="text-xs text-muted-foreground">24/7 Care</p>
              </div>
            </div>            
          </div>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully selected products that combine style, quality, and value.
            Login to add items to your cart and place orders.
          </p>
        </div>
        <PublicProductList onLoginRequired={onLoginRequired} />
      </div>
    </div>
  );
};

export default PublicHomepage;