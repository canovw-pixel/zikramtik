import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { ordersAPI } from '../services/api';
import { countries } from '../data/mock';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await ordersAPI.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Order not found:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center" data-testid="order-confirmation">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Siparisiniz Alindi!
          </h1>

          <p className="text-gray-600 mb-2 text-lg">
            Siparisizin icin tesekkur ederiz.
          </p>

          {order && (
            <div className="mt-8 text-left">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Siparis No</span>
                  <span className="font-bold text-gray-900" data-testid="order-number">{order.order_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Durum</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium" data-testid="order-status">
                    Beklemede
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Toplam</span>
                  <span className="font-bold text-burgundy-700 text-lg" data-testid="order-total">
                    {order.currency} {order.total_amount?.toLocaleString()}
                  </span>
                </div>

                {order.products && order.products.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Urunler</p>
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} adet</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.currency} {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {order.shipping_address && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-700">Teslimat Adresi</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.shipping_address.full_name}<br />
                      {order.shipping_address.address}<br />
                      {order.shipping_address.city} {order.shipping_address.zip_code}<br />
                      {order.shipping_address.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-burgundy-700 hover:bg-burgundy-800 text-white px-8 py-3 flex items-center justify-center space-x-2"
              data-testid="continue-shopping-button"
            >
              <span>Alisverise Devam Et</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
