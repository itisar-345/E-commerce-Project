import { useState, useEffect } from 'react';
import { ShoppingBag, User, LogIn, LogOut, Package, ShoppingCart, BarChart3, Heart, Search } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/Orders';
import CustomerDashboard from './components/CustomerDashboard';
import VendorDashboard from './components/VendorDashboard';
import VendorOrders from './components/VendorOrders';
import PublicHomepage from './components/PublicHomepage';
import Wishlist from './components/Wishlist';
import { Button } from './components/ui/button';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'CUSTOMER' | 'VENDOR' | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register' | 'dashboard' | 'cart' | 'orders' | 'wishlist'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType') as 'CUSTOMER' | 'VENDOR' | null;
    if (token && storedUserType) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userType = payload.userType as 'CUSTOMER' | 'VENDOR';
      
      localStorage.setItem('userType', userType);
      setIsAuthenticated(true);
      setUserType(userType);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Failed to decode token:', error);
      localStorage.removeItem('token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentView('home');
  };

  const handleLoginRequired = () => {
    setCurrentView('login');
  };

  const renderNavigation = () => {
    return (
      <nav className="bg-white/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">PeachyShop</h1>
                <span className="text-xs text-muted-foreground">
                  {isAuthenticated 
                    ? (userType === 'CUSTOMER' ? 'Customer Portal' : 'Vendor Dashboard')
                    : 'Premium E-commerce'
                  }
                </span>
              </div>
            </div>
            
            {/* Search Bar */}
            {((isAuthenticated && userType === 'CUSTOMER' && currentView === 'dashboard') || 
             (isAuthenticated && userType === 'VENDOR' && currentView === 'dashboard') ||
             (!isAuthenticated && currentView === 'home')) && (
              <div className="flex-1 max-w-xl mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {userType === 'CUSTOMER' && (
                    <>
                      <Button
                        variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                        onClick={() => setCurrentView('dashboard')}
                        className="flex items-center space-x-2"
                      >
                        <Package className="h-4 w-4" />
                        <span>Products</span>
                      </Button>
                      <Button
                        variant={currentView === 'wishlist' ? 'default' : 'ghost'}
                        onClick={() => setCurrentView('wishlist')}
                        className="flex items-center space-x-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Wishlist</span>
                      </Button>
                      <Button
                        variant={currentView === 'orders' ? 'default' : 'ghost'}
                        onClick={() => setCurrentView('orders')}
                        className="flex items-center space-x-2"
                      >
                        <Package className="h-4 w-4" />
                        <span>Orders</span>
                      </Button>
                      <Button
                        variant={currentView === 'cart' ? 'default' : 'ghost'}
                        onClick={() => setCurrentView('cart')}
                        className="flex items-center space-x-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Cart</span>
                      </Button>
                    </>
                  )}
                  
                  {userType === 'VENDOR' && (
                    <>
                      <Button
                        variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                        onClick={() => setCurrentView('dashboard')}
                        className="flex items-center space-x-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Button>
                      <Button
                        variant={currentView === 'orders' ? 'default' : 'ghost'}
                        onClick={() => setCurrentView('orders')}
                        className="flex items-center space-x-2"
                      >
                        <Package className="h-4 w-4" />
                        <span>Orders</span>
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentView('register')}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Register</span>
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setCurrentView('login')}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      switch (currentView) {
        case 'login':
          return (
            <Login 
              onLogin={handleLogin}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          );
        case 'register':
          return (
            <Register 
              onRegister={() => setCurrentView('login')}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          );
        default:
          return <PublicHomepage searchQuery={searchQuery} onLoginRequired={handleLoginRequired} onViewDetails={() => setShowHeader(false)} onBackFromDetails={() => setShowHeader(true)} />;
      }
    }

    if (userType === 'CUSTOMER') {
      switch (currentView) {
        case 'cart':
          return <Cart />;
        case 'orders':
          return <Orders onContinueShopping={() => setCurrentView('dashboard')} />;
        case 'wishlist':
          return (
            <Wishlist 
              onBack={() => setCurrentView('dashboard')}
              onViewProduct={() => setCurrentView('dashboard')}
            />
          );
        default:
          return <CustomerDashboard searchQuery={searchQuery} onViewDetails={() => setShowHeader(false)} onBackFromDetails={() => setShowHeader(true)} />;
      }
    }

    if (userType === 'VENDOR') {
      switch (currentView) {
        case 'orders':
          return <VendorOrders />;
        default:
          return <VendorDashboard searchQuery={searchQuery} onViewDetails={() => setShowHeader(false)} onBackFromDetails={() => setShowHeader(true)} />;
      }
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {showHeader && renderNavigation()}
      <main className="animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
