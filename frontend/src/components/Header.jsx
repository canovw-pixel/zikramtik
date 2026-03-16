import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Globe, Menu, X } from 'lucide-react';
import CountrySelector from './CountrySelector';
import { useCart } from '../context/CartContext';

const Header = ({ selectedCountry, onCountryChange }) => {
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-burgundy-600 cursor-pointer">
                <img
                  src="https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/99jr70kx_logo.jpeg"
                  alt="Zikra Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-burgundy-900 elegant-script text-2xl cursor-pointer">Zikra</h1>
                <p className="text-xs text-gray-600 brand-script">Craponia Atelier</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium">
                Ana Sayfa
              </a>
              <a href="#products" className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium">
                Ürünler
              </a>
              <a href="#about" className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium">
                Hakkımızda
              </a>
              <a href="#contact" className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium">
                İletişim
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Country Selector */}
              <button
                onClick={() => setShowCountryModal(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-burgundy-50 transition-colors"
              >
                <Globe className="w-5 h-5 text-burgundy-700" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {selectedCountry.flag} {selectedCountry.currency}
                </span>
              </button>

              {/* Cart */}
              <button 
                onClick={() => navigate('/cart')}
                className="relative p-2 hover:bg-burgundy-50 rounded-lg transition-colors group"
                title="Sepetime Git"
                data-testid="cart-button"
              >
                <ShoppingCart className="w-6 h-6 text-burgundy-700 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burgundy-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-pulse" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-burgundy-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-burgundy-700" />
                ) : (
                  <Menu className="w-6 h-6 text-burgundy-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </a>
                <a
                  href="#products"
                  className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ürünler
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hakkımızda
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-burgundy-700 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  İletişim
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Country Selector Modal */}
      {showCountryModal && (
        <CountrySelector
          selectedCountry={selectedCountry}
          onSelect={(country) => {
            onCountryChange(country);
            setShowCountryModal(false);
          }}
          onClose={() => setShowCountryModal(false)}
        />
      )}
    </>
  );
};

export default Header;
