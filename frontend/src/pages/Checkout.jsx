import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { countries } from '../data/mock';
import { toast } from '../hooks/use-toast';
import { formatPrice } from '../utils/format';
import { detectCountryByIP } from '../utils/geoip';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  useState(() => {
    detectCountryByIP().then(detected => setSelectedCountry(detected));
  }, []);
  const [form, setForm] = useState({
    full_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: selectedCountry.name,
    phone: '',
  });

  const totalAmount = getCartTotal();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast({ title: 'Hata', description: 'Sepetiniz bos', variant: 'destructive' });
      return;
    }

    const requiredFields = ['full_name', 'address', 'city', 'zip_code', 'phone'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        toast({ title: 'Hata', description: 'Lutfen tum alanlari doldurun', variant: 'destructive' });
        return;
      }
    }

    setLoading(true);

    try {
      const orderData = {
        products: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          currency: item.currency,
          quantity: item.quantity,
        })),
        country: {
          code: cartItems[0]?.countryCode || selectedCountry.code,
          name: selectedCountry.name,
          currency: cartItems[0]?.currency || selectedCountry.currency,
        },
        shipping_address: { ...form },
        billing_address: { ...form },
        customer_email: customerEmail || null,
      };

      const response = await ordersAPI.create(orderData);
      const orderId = response.data?.order?.id;

      // Mock payment - auto-confirm
      clearCart();
      toast({ title: 'Basarili', description: 'Siparisiniz olusturuldu!' });
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Order error:', error);
      toast({ title: 'Hata', description: 'Siparis olusturulamadi. Lutfen tekrar deneyin.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header selectedCountry={selectedCountry} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz bos</h1>
          <p className="text-gray-600 mb-8">Odeme yapabilmek icin sepetinize urun ekleyin.</p>
          <Button onClick={() => navigate('/')} className="bg-burgundy-700 hover:bg-burgundy-800 text-white" data-testid="go-shopping-btn">
            Alisverise Basla
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedCountry={selectedCountry} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-gray-600 hover:text-burgundy-700 mb-8 transition-colors"
          data-testid="checkout-back-button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Sepete Don</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Cinzel', serif" }} data-testid="checkout-title">
          Odeme
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="shipping-form">
                <div className="flex items-center space-x-3 mb-6">
                  <Truck className="w-6 h-6 text-burgundy-700" />
                  <h2 className="text-xl font-bold text-gray-900">Teslimat Bilgileri</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ad Soyad"
                      required
                      data-testid="input-full-name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Adres"
                      required
                      data-testid="input-address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sehir *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Sehir"
                      required
                      data-testid="input-city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ilce</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ilce"
                      data-testid="input-state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu *</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={form.zip_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Posta Kodu"
                      required
                      data-testid="input-zip-code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="+90 5XX XXX XX XX"
                      required
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta (Kargo bildirimi icin)</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="ornek@email.com"
                      data-testid="input-email"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Info (Mock) */}
              <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="payment-section">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="w-6 h-6 text-burgundy-700" />
                  <h2 className="text-xl font-bold text-gray-900">Odeme</h2>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm font-medium">
                    Odeme sistemi yaklnda aktif olacaktir. Siparisleriniz kaydedilecek ve odeme baglantisi ayrica gonderilecektir.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24" data-testid="checkout-summary">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Siparis Ozeti</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} adet</p>
                      </div>
                      <p className="text-sm font-bold text-burgundy-700">
                        {formatPrice(item.price * item.quantity, item.symbol)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
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
                    <span className="text-burgundy-700" data-testid="checkout-total">
                      {formatPrice(totalAmount, cartItems[0]?.symbol)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-burgundy-700 hover:bg-burgundy-800 text-white py-4 text-lg disabled:opacity-50"
                  data-testid="place-order-button"
                >
                  {loading ? 'Siparis Olusturuluyor...' : 'Siparisi Onayla'}
                </Button>

                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Bilgileriniz guvendedir</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
