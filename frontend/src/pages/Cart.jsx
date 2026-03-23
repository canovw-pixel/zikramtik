import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { countries } from '../data/mock';
import { formatPrice } from '../utils/format';
import { detectCountryByIP } from '../utils/geoip';

const Cart = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = React.useState(countries[1]);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  React.useEffect(() => {
    detectCountryByIP().then(detected => setSelectedCountry(detected));
  }, []);

  const totalAmount = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedCountry={selectedCountry} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-burgundy-700 mb-8 transition-colors"
          data-testid="cart-back-button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri Don</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Cinzel', serif" }} data-testid="cart-title">
          Sepetim
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center" data-testid="empty-cart">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Bos</h2>
            <p className="text-gray-600 mb-8">
              Henuz sepetinize urun eklemediniz. Alisverise baslamak icin urunlerimize goz atin.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-burgundy-700 hover:bg-burgundy-800 text-white px-8 py-3"
              data-testid="start-shopping-button"
            >
              Alisverise Basla
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4" data-testid="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6" data-testid={`cart-item-${item.id}`}>
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                      <p className="text-lg font-bold text-burgundy-700">
                        {formatPrice(item.price, item.symbol)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        data-testid={`quantity-decrease-${item.id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center" data-testid={`quantity-value-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        data-testid={`quantity-increase-${item.id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24" data-testid="order-summary">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Siparis Ozeti</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam ({getCartCount()} urun)</span>
                    <span>{formatPrice(totalAmount, cartItems[0]?.symbol)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span className="text-green-600">Ucretsiz</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span className="text-burgundy-700" data-testid="cart-total">
                      {formatPrice(totalAmount, cartItems[0]?.symbol)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-burgundy-700 hover:bg-burgundy-800 text-white py-4 text-lg"
                  data-testid="proceed-checkout-button"
                >
                  Odemeye Gec
                </Button>

                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>&#128666;</span>
                    <span>Ucretsiz kargo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>&#128274;</span>
                    <span>Guvenli odeme</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>&#8617;&#65039;</span>
                    <span>14 gun iade hakki</span>
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
