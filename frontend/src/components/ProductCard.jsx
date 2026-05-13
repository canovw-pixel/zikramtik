import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPrice, getProductPricing } from '../utils/format';

const ProductCard = ({ product, selectedCountry }) => {
  const navigate = useNavigate();

  const pricing = getProductPricing(product, selectedCountry.code);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleProductClick}
      data-testid={`product-card-${product.id}`}
    >
      {/* Discount Badge */}
      {pricing.hasDiscount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1" data-testid={`discount-badge-${product.id}`}>
            <span>%{Math.round(pricing.discount)}</span>
            <span>İNDİRİM</span>
          </span>
        </div>
      )}

      {/* Favorite Button */}
      <button className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-burgundy-700 hover:text-white transition-all">
        <Heart className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-cream-50 to-burgundy-50">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <button className="px-6 py-3 bg-white text-burgundy-700 rounded-xl font-semibold hover:bg-burgundy-50 transition-all shadow-lg flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <ShoppingCart className="w-5 h-5" />
            <span>Hızlı Satın Al</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {product.category_name && (
          <span className="inline-block px-3 py-1 bg-burgundy-100 text-burgundy-700 text-xs font-semibold rounded-full mb-3">
            {product.category_name}
          </span>
        )}
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-burgundy-700 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 product-description">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Fiyat</p>
            {pricing.hasDiscount ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm line-through text-gray-400" data-testid={`old-price-${product.id}`}>
                  {formatPrice(pricing.base, selectedCountry.symbol)}
                </span>
                <span className="text-2xl font-bold text-red-600" data-testid={`new-price-${product.id}`}>
                  {formatPrice(pricing.final, selectedCountry.symbol)}
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-burgundy-700">
                {formatPrice(pricing.base, selectedCountry.symbol)}
              </p>
            )}
          </div>
          
          <button className="p-3 bg-burgundy-700 text-white rounded-xl hover:bg-burgundy-800 transition-all shadow-md hover:shadow-lg">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
