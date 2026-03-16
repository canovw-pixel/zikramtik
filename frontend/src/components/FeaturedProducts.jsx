import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';

const FeaturedProducts = ({ selectedCountry, products }) => {
  const featuredProducts = products.filter(p => p.featured);

  const formatPrice = (price) => {
    return `${selectedCountry.symbol}${price}`;
  };

  const getPrice = (product) => {
    const countryPrice = product.prices?.[selectedCountry.code];
    return countryPrice?.price || 0;
  };

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-gold-600 fill-gold-600" />
            <span className="text-burgundy-700 font-semibold uppercase tracking-wide">Öne Çıkan Koleksiyon</span>
            <Star className="w-6 h-6 text-gold-600 fill-gold-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Mücevher Ustasından Kalplere
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto product-description">
            Bazı yolculuklar ellerle başlar… Bazıları ise kalple.
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Featured Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-2 bg-burgundy-700 text-white text-sm font-semibold rounded-full shadow-lg flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-white" />
                  <span>Öne Çıkan</span>
                </span>
              </div>

              {/* Product Image */}
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-burgundy-50 to-gold-50">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Product Info */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-burgundy-700 transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed product-description">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fiyat</p>
                    <p className="text-3xl font-bold text-burgundy-700">
                      {formatPrice(getPrice(product))}
                    </p>
                  </div>
                  <button className="px-6 py-3 bg-burgundy-700 text-white rounded-xl font-semibold hover:bg-burgundy-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Sepete Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
