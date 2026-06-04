import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  RefreshCw, 
  Wallet, 
  Gift, 
  Users, 
  History, 
  MessageSquare,
  LogOut,
  Globe,
  Menu,
  X
} from 'lucide-react';
import './i18n/config';

// Pages (will create these next)
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Buy from './pages/Buy';
import Swap from './pages/Swap';
import MyWallet from './pages/Wallet';
import Orders from './pages/Orders';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleLang = () => {
    const newLang = i18n.language === 'bn' ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { name: t('buy'), icon: <ShoppingCart size={20} />, path: '/buy' },
    { name: t('swap'), icon: <RefreshCw size={20} />, path: '/swap' },
    { name: t('wallet'), icon: <Wallet size={20} />, path: '/wallet' },
    { name: t('orders'), icon: <History size={20} />, path: '/orders' },
    { name: t('support'), icon: <MessageSquare size={20} />, path: '/support' },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-dashboard-gradient text-white flex flex-col">
        {/* Header */}
        <header className="bg-accent border-b border-gray-700 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-secondary font-bold text-xl">M</div>
              <span className="text-xl font-bold tracking-tight hidden sm:inline">BGC Private</span>
            </Link>

            <div className="flex items-center gap-4">
              <button onClick={toggleLang} className="p-2 hover:bg-secondary rounded-full transition-colors flex items-center gap-1 text-sm font-medium">
                <Globe size={18} />
                <span>{i18n.language === 'bn' ? 'EN' : 'বাং'}</span>
              </button>

              {token ? (
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline text-sm text-gray-300">{user?.username}</span>
                  <button onClick={logout} className="p-2 hover:bg-red-900/30 text-red-400 rounded-full transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-bold bg-primary text-secondary rounded-lg hover:opacity-90">{t('login')}</Link>
                </div>
              )}

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 max-w-7xl mx-auto w-full">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:flex flex-col w-64 p-6 border-r border-gray-800 space-y-2">
            <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
              <LayoutDashboard size={22} className="text-primary" />
              <span className="font-medium">Dashboard</span>
            </Link>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-gray-400 hover:text-white">
                <span className="text-primary">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/buy" element={token ? <Buy /> : <Navigate to="/login" />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/wallet" element={<MyWallet />} />
              <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-accent border-t border-gray-800 p-6 text-center text-gray-500 text-sm">
          {t('footer_text')}
        </footer>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/80 z-40 md:hidden pt-20 px-6 flex flex-col gap-4 animate-in fade-in duration-300">
             <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-accent rounded-xl">
               <LayoutDashboard size={22} className="text-primary" />
               <span className="text-lg font-medium">Dashboard</span>
             </Link>
             {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-accent rounded-xl">
                <span className="text-primary">{item.icon}</span>
                <span className="text-lg font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
