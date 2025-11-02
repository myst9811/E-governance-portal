import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Bell, Wallet, Loader2, Moon, Sun } from 'lucide-react';
import { useWeb3 } from '../src/Web3Context';
import { useTheme } from '../src/ThemeContext';

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isConnecting, error: web3Error } = useWeb3();
  const { theme, toggleTheme } = useTheme();
  const [notifications] = React.useState(3);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWalletAction = async () => {
    if (account) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const handleServicesClick = () => {
    if (currentPage === 'home') {
      // If we're on home page, scroll to services section
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home with hash
      navigate('/#services');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg backdrop-blur-sm border-b border-blue-500/20 dark:border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <span className="bg-gradient-to-r from-white to-blue-100 dark:to-gray-300 bg-clip-text text-transparent">
              eGov Portal
            </span>
          </button>

          <nav className="hidden md:flex space-x-1 font-medium bg-white/10 dark:bg-black/20 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-md transition-all ${
                currentPage === 'home'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <button
              onClick={handleServicesClick}
              className={`px-4 py-2 rounded-md transition-all ${
                currentPage === 'services'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => navigate('/voting')}
              className={`px-4 py-2 rounded-md transition-all ${
                currentPage === 'voting'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Voting
            </button>
            <button
              onClick={() => navigate('/admin')}
              className={`px-4 py-2 rounded-md transition-all ${
                currentPage === 'admin'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Admin
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Wallet Connection */}
            <Button
              onClick={handleWalletAction}
              disabled={isConnecting}
              className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 shadow-md"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : account ? (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  {formatAddress(account)}
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        </div>

        {web3Error && (
          <div className="mt-2 text-sm text-red-200 bg-red-900 bg-opacity-50 p-2 rounded">
            {web3Error}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
