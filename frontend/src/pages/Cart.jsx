import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { countries } from '../data/mock';

const Cart = () => {
  const navigate = useNavigate();
  const [selectedCountry] = React.useState(countries[1]); // Turkey
  const [cart] = React.useState(0);

  // Mock cart items - In real app, this would come from state management
  const [cartItems] = React.useState([]);

  const formatPrice = (price) => {
    return `${selectedCountry.symbol}${price.toLocaleString()}`;
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} selectedCountry={selectedCountry} onCountryChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-burgundy-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri Dön</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
          Sepetim
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-8">
              Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünlerimize göz atın.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-burgundy-700 hover:bg-burgundy-800 text-white px-8 py-3"
            >
              Alışverişe Başla
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                      <p className="text-lg font-bold text-burgundy-700">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span className="text-green-600">Ücretsiz</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span className="text-burgundy-700">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <Button className="w-full bg-burgundy-700 hover:bg-burgundy-800 text-white py-4 text-lg">
                  Ödemeye Geç
                </Button>

                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>🚚</span>
                    <span>Ücretsiz kargo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Güvenli ödeme</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>↩️</span>
                    <span>14 gün iade hakkı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
