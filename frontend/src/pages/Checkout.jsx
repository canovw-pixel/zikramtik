import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { ordersAPI, paymentAPI } from '../services/api';
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
  const [showPayment, setShowPayment] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [tlEquivalent, setTlEquivalent] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
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

  // Fetch TL equivalent when currency is not TRY
  useEffect(() => {
    const currency = cartItems[0]?.currency;
    if (currency && currency !== 'TRY' && currency !== 'TL' && totalAmount > 0) {
      paymentAPI.convertToTL(totalAmount, currency)
        .then(resp => setTlEquivalent(resp.data))
        .catch(() => setTlEquivalent(null));
    } else {
      setTlEquivalent(null);
    }
  }, [totalAmount, cartItems]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getUserIP = async () => {
    try {
      const resp = await fetch('https://api.ipify.org?format=json');
      const data = await resp.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast({ title: 'Hata', description: 'Sepetiniz bo\u015F', variant: 'destructive' });
      return;
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      toast({ title: 'Hata', description: 'L\u00FCtfen ge\u00E7erli bir e-posta adresi girin', variant: 'destructive' });
      return;
    }

    const requiredFields = ['full_name', 'address', 'city', 'zip_code', 'phone'];
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        toast({ title: 'Hata', description: 'L\u00FCtfen t\u00FCm alanlar\u0131 doldurun', variant: 'destructive' });
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
        customer_email: customerEmail,
      };

      const orderResponse = await ordersAPI.create(orderData);
      const orderId = orderResponse.data?.order?.id;
      setCurrentOrderId(orderId);

      const tokenResponse = await paymentAPI.getToken({
        order_id: orderId,
        user_ip: await getUserIP(),
      });

      if (tokenResponse.data?.status === 'success') {
        setIframeUrl(tokenResponse.data.iframe_url);
        setShowPayment(true);
      } else {
        throw new Error(tokenResponse.data?.detail || '\u00D6deme ba\u015Flat\u0131lamad\u0131');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const msg = error.response?.data?.detail || '\u00D6deme i\u015Flemi ba\u015Flat\u0131lamad\u0131. L\u00FCtfen tekrar deneyin.';
      toast({ title: 'Hata', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showPayment || !currentOrderId) return;

    const interval = setInterval(async () => {
      try {
        const resp = await paymentAPI.checkStatus(currentOrderId);
        const ps = resp.data?.payment_status;
        if (ps === 'success') {
          clearInterval(interval);
          clearCart();
          toast({ title: 'Ba\u015Far\u0131l\u0131', description: '\u00D6demeniz al\u0131nd\u0131!' });
          navigate(`/order-confirmation/${currentOrderId}`);
        } else if (ps === 'failed') {
          clearInterval(interval);
          toast({ title: 'Hata', description: '\u00D6deme ba\u015Far\u0131s\u0131z oldu.', variant: 'destructive' });
          setShowPayment(false);
        }
      } catch {
        // ignore
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showPayment, currentOrderId, clearCart, navigate]);

  // Load PayTR iFrameResizer script when payment iframe is shown
  useEffect(() => {
    if (showPayment && iframeUrl) {
      const script = document.createElement('script');
      script.src = 'https://www.paytr.com/js/iframeResizer.min.js';
      script.async = true;
      script.onload = () => {
        if (window.iFrameResize) {
          window.iFrameResize({}, '#paytriframe');
        }
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showPayment, iframeUrl]);

  if (cartItems.length === 0 && !showPayment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header selectedCountry={selectedCountry} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="empty-cart-title">
            {"Sepetiniz bo\u015F"}
          </h1>
          <p className="text-gray-600 mb-8">
            {"\u00D6deme yapabilmek i\u00E7in sepetinize \u00FCr\u00FCn ekleyin."}
          </p>
          <Button onClick={() => navigate('/')} className="bg-burgundy-700 hover:bg-burgundy-800 text-white" data-testid="go-shopping-btn">
            {"Al\u0131\u015Fveri\u015Fe Ba\u015Fla"}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (showPayment && iframeUrl) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header selectedCountry={selectedCountry} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
          <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="payment-iframe-container">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-6 h-6 text-burgundy-700" />
              <h2 className="text-xl font-bold text-gray-900">{"\u00D6deme"}</h2>
            </div>
            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>{"256-bit SSL ile korunan g\u00FCvenli \u00F6deme sayfas\u0131"}</span>
            </div>
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              id="paytriframe"
              frameBorder="0"
              scrolling="no"
              style={{ width: '100%', border: 'none' }}
              data-testid="paytr-iframe"
              title="PayTR Payment"
            />
          </div>
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
          <span>{"Sepete D\u00F6n"}</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Source Serif 4', serif" }} data-testid="checkout-title">
          {"\u00D6deme"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="shipping-form">
                <div className="flex items-center space-x-3 mb-6">
                  <Truck className="w-6 h-6 text-burgundy-700" />
                  <h2 className="text-xl font-bold text-gray-900">Teslimat Bilgileri</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ad Soyad" required data-testid="input-full-name" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="ornek@email.com" required data-testid="input-email" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Adres" required data-testid="input-address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{"\u015Eehir *"}</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder={"\u015Eehir"} required data-testid="input-city" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{"\u0130l\u00E7e"}</label>
                    <input type="text" name="state" value={form.state} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder={"\u0130l\u00E7e"} data-testid="input-state" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu *</label>
                    <input type="text" name="zip_code" value={form.zip_code} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="Posta Kodu" required data-testid="input-zip-code" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                      placeholder="+90 5XX XXX XX XX" required data-testid="input-phone" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24" data-testid="checkout-summary">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{`Sipari\u015F \u00D6zeti`}</h2>

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
                    <span>{`Ara Toplam (${getCartCount()} \u00FCr\u00FCn)`}</span>
                    <span>{formatPrice(totalAmount, cartItems[0]?.symbol)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span className="text-green-600">{"\u00DCcretsiz"}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span className="text-burgundy-700" data-testid="checkout-total">
                      {formatPrice(totalAmount, cartItems[0]?.symbol)}
                    </span>
                  </div>
                  {tlEquivalent && (
                    <div className="bg-burgundy-50 rounded-lg p-3 text-center" data-testid="tl-equivalent">
                      <p className="text-sm text-gray-600">
                        {"PayTR \u00FCzerinden tahsil edilecek tutar:"}
                      </p>
                      <p className="text-lg font-bold text-burgundy-700">
                        {`${tlEquivalent.tl_formatted} \u20BA`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {"(Anl\u0131k d\u00F6viz kuru ile hesaplanm\u0131\u015Ft\u0131r)"}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-burgundy-700 hover:bg-burgundy-800 text-white py-4 text-lg disabled:opacity-50"
                  data-testid="place-order-button"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {"Y\u00FCkleniyor..."}
                    </span>
                  ) : (
                    "\u00D6demeye Ge\u00E7"
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>{"PayTR g\u00FCvenli \u00F6deme altyap\u0131s\u0131"}</span>
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
