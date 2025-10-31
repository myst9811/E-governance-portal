import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Bell, Wallet, Loader2 } from 'lucide-react';
import { useWeb3 } from '../src/Web3Context';

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isConnecting, error: web3Error } = useWeb3();
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
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold hover:opacity-90 transition"
          >
            eGov Portal
          </button>

          <nav className="hidden md:flex space-x-6 font-medium">
            <button
              onClick={() => navigate('/')}
              className={`hover:text-blue-200 transition ${currentPage === 'home' ? 'text-blue-200' : ''}`}
            >
              Home
            </button>
            <button
              onClick={handleServicesClick}
              className={`hover:text-blue-200 transition ${currentPage === 'services' ? 'text-blue-200' : ''}`}
            >
              Services
            </button>
            <button
              onClick={() => navigate('/voting')}
              className={`hover:text-blue-200 transition ${currentPage === 'voting' ? 'text-blue-200' : ''}`}
            >
              Voting
            </button>
            <button
              onClick={() => navigate('/admin')}
              className={`hover:text-blue-200 transition ${currentPage === 'admin' ? 'text-blue-200' : ''}`}
            >
              Admin
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-blue-700 rounded-full transition">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <Button
              onClick={handleWalletAction}
              disabled={isConnecting}
              className="bg-white text-blue-600 hover:bg-gray-100"
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
