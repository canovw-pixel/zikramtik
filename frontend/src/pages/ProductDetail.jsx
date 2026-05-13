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
import { formatPrice, getProductPricing } from '../utils/format';
import { detectCountryByIP } from '../utils/geoip';
import ProductReviews from '../components/ProductReviews';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
    detectCountryByIP().then(detected => setSelectedCountry(detected));
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
    const pricing = getProductPricing(product, selectedCountry.code);
    return pricing.final;
  };

  const pricing = product ? getProductPricing(product, selectedCountry.code) : { base: 0, final: 0, discount: 0, hasDiscount: false };

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

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Source Serif 4', serif" }}>
              {product.name}
            </h1>

            {product.short_name && (
              <p className="text-xl text-gray-600">{product.short_name}</p>
            )}

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fiyat</p>
                  {pricing.hasDiscount ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl line-through text-gray-400" data-testid="detail-old-price">
                          {formatPriceLocal(pricing.base)}
                        </span>
                        <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full" data-testid="detail-discount-badge">
                          %{Math.round(pricing.discount)} İNDİRİM
                        </span>
                      </div>
                      <p className="text-4xl font-bold text-red-600" data-testid="detail-new-price">
                        {formatPriceLocal(pricing.final)}
                      </p>
                      <p className="text-sm text-green-700 font-medium">
                        {formatPriceLocal(pricing.base - pricing.final)} kazanıyorsunuz
                      </p>
                    </div>
                  ) : (
                    <p className="text-4xl font-bold text-burgundy-700">
                      {formatPriceLocal(pricing.base)}
                    </p>
                  )}
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

            {/* Bulk Order WhatsApp Card */}
            <a
              href={`https://wa.me/905530766000?text=${encodeURIComponent('Merhaba, ' + (product?.name || 'Zikra') + ' ürününüz için toplu sipariş hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl p-5 bg-gradient-to-br from-[#25D366] to-[#1ebe5d] hover:shadow-xl transition-all hover:-translate-y-0.5 group"
              data-testid="bulk-order-whatsapp-card"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.711.306 1.265.489 1.697.626.713.226 1.362.194 1.875.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <div className="flex-1 text-white">
                  <p className="font-bold text-base">Toplu Sipariş için İletişime Geçin</p>
                  <p className="text-sm text-white/90 mt-0.5">Kurumsal ve hediyelik toplu siparişlerinizde özel fiyat</p>
                </div>
                <span className="hidden sm:block text-white font-medium text-sm group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 text-white/95 text-sm font-medium flex items-center gap-2">
                <span>📱</span>
                <span>WhatsApp: +90 553 076 60 00</span>
              </div>
            </a>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={productId} />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
