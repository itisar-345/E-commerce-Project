import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: string;
  userType: 'CUSTOMER' | 'VENDOR' | null;
  isLoggedIn: boolean;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  userType,
  isLoggedIn,
  onViewChange,
  onLogout,
}) => {
  if (!isLoggedIn) return null;

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <h1 className="text-lg sm:text-xl font-bold text-primary">Peachy Shop</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userType === 'CUSTOMER' && (
              <>
                <Button
                  variant={currentView === 'products' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('products')}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Products
                </Button>
                <Button
                  variant={currentView === 'cart' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('cart')}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Cart
                </Button>
                <Button
                  variant={currentView === 'orders' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('orders')}
                  size="sm"
                  className="hidden sm:inline-flex text-xs sm:text-sm"
                >
                  My Orders
                </Button>
              </>
            )}
            
            {userType === 'VENDOR' && (
              <>
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('dashboard')}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'vendor-orders' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('vendor-orders')}
                  size="sm"
                  className="hidden sm:inline-flex text-xs sm:text-sm"
                >
                  Orders
                </Button>
              </>
            )}
            
            <Button variant="outline" onClick={onLogout} size="sm" className="text-xs sm:text-sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;