import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { countries } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';
import { formatPrice } from '../utils/format';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(countries[1]); // Turkey
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ürün bulunamadı',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = () => {
    if (!product) return 0;
    const countryPrice = product.prices?.[selectedCountry.code];
    return countryPrice?.price || 0;
  };

  const formatPriceLocal = (price) => {
    return formatPrice(price, selectedCountry.symbol);
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedCountry);
  };

  const nextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentImage = product.images?.[currentImageIndex] || 'https://via.placeholder.com/600';

  return (
    <div className="min-h-screen bg-white">
      <Header 
        selectedCountry={selectedCountry} 
        onCountryChange={setSelectedCountry}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-burgundy-700 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Geri Dön</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-burgundy-50 to-gold-50 shadow-xl">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {product.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-burgundy-700 text-white text-sm font-semibold rounded-full shadow-lg flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-white" />
                    <span>Öne Çıkan</span>
                  </span>
                </div>
              )}

              {/* Image Navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-burgundy-700 scale-105'
                        : 'border-gray-200 hover:border-burgundy-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <span className="inline-block px-4 py-2 bg-burgundy-100 text-burgundy-700 text-sm font-semibold rounded-full">
              {product.category_name}
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              {product.name}
            </h1>

            {product.short_name && (
              <p className="text-xl text-gray-600">{product.short_name}</p>
            )}

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fiyat</p>
                  <p className="text-4xl font-bold text-burgundy-700">
                    {formatPriceLocal(getPrice())}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedCountry.flag} {selectedCountry.name}</p>
                  <p className="text-xs text-gray-400">{selectedCountry.currency}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
              <p className="text-gray-600 leading-relaxed product-description text-lg">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                product.in_stock
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.in_stock ? '✓ Stokta Mevcut' : '✗ Stokta Yok'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1 bg-burgundy-700 hover:bg-burgundy-800 text-white py-6 text-lg flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Sepete Ekle</span>
              </Button>
              
              <Button
                variant="outline"
                className="py-6 px-6 border-2 border-burgundy-700 text-burgundy-700 hover:bg-burgundy-50"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-cream-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>🚚</span>
                <span>Ücretsiz kargo (Türkiye içi)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>🔒</span>
                <span>Güvenli ödeme</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>↩️</span>
                <span>14 gün içinde iade hakkı</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
