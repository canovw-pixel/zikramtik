import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { ordersAPI } from '../services/api';
import { countries } from '../data/mock';
import { toast } from '../hooks/use-toast';
import { getCargoTrackingUrl } from '../utils/cargo';
import { formatPrice } from '../utils/format';
import { detectCountryByIP } from '../utils/geoip';

const STATUS_STEPS = {
  pending: { step: 1, label: 'Beklemede', icon: Clock, color: 'text-amber-600' },
  paid: { step: 2, label: 'Odendi', icon: CheckCircle, color: 'text-blue-600' },
  processing: { step: 2, label: 'Hazirlaniyor', icon: Package, color: 'text-purple-600' },
  shipped: { step: 3, label: 'Kargoda', icon: Truck, color: 'text-cyan-600' },
  delivered: { step: 4, label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600' },
  cancelled: { step: 0, label: 'Iptal Edildi', icon: XCircle, color: 'text-red-600' },
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useState(() => {
    detectCountryByIP().then(detected => setSelectedCountry(detected));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast({ title: 'Hata', description: 'Lutfen siparis numarasi girin', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await ordersAPI.trackByNumber(orderNumber.trim().toUpperCase());
      setOrder(response.data);
    } catch (error) {
      setOrder(null);
      toast({ title: 'Bulunamadi', description: 'Bu siparis numarasiyla eslesen siparis bulunamadi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = order ? STATUS_STEPS[order.status] || STATUS_STEPS.pending : null;
  const StatusIcon = statusInfo?.icon || Clock;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedCountry={selectedCountry} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-burgundy-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Ana Sayfa</span>
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Cinzel', serif" }} data-testid="tracking-title">
          Siparis Takibi
        </h1>
        <p className="text-gray-600 mb-8">Siparis numaranizi girerek kargonuzu takip edebilirsiniz.</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORN: ORD-XXXXXXXX"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none text-lg"
                data-testid="tracking-input"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-burgundy-700 hover:bg-burgundy-800 text-white px-8 text-lg disabled:opacity-50"
              data-testid="tracking-search-btn"
            >
              {loading ? 'Araniyor...' : 'Sorgula'}
            </Button>
          </div>
        </form>

        {/* Results */}
        {searched && !loading && !order && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center" data-testid="tracking-not-found">
            <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Siparis Bulunamadi</h2>
            <p className="text-gray-600">Lutfen siparis numaranizi kontrol edip tekrar deneyin.</p>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-testid="tracking-result">
            {/* Status Header */}
            <div className={`p-6 ${order.status === 'cancelled' ? 'bg-red-50' : order.status === 'delivered' ? 'bg-green-50' : order.status === 'shipped' ? 'bg-cyan-50' : 'bg-amber-50'}`}>
              <div className="flex items-center space-x-3">
                <StatusIcon className={`w-8 h-8 ${statusInfo?.color}`} />
                <div>
                  <h2 className="text-xl font-bold text-gray-900" data-testid="tracking-status">{statusInfo?.label}</h2>
                  <p className="text-sm text-gray-600">Siparis No: {order.order_number}</p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            {order.status !== 'cancelled' && (
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  {[
                    { step: 1, label: 'Siparis Alindi' },
                    { step: 2, label: 'Hazirlaniyor' },
                    { step: 3, label: 'Kargoda' },
                    { step: 4, label: 'Teslim Edildi' },
                  ].map((s, idx) => {
                    const isActive = (statusInfo?.step || 0) >= s.step;
                    return (
                      <React.Fragment key={s.step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-burgundy-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {s.step}
                          </div>
                          <span className={`text-xs mt-1 text-center ${isActive ? 'text-burgundy-700 font-medium' : 'text-gray-400'}`}>{s.label}</span>
                        </div>
                        {idx < 3 && (
                          <div className={`flex-1 h-1 mx-2 rounded ${(statusInfo?.step || 0) > s.step ? 'bg-burgundy-700' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tracking Info */}
            {order.tracking_number && (
              <div className="mx-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg" data-testid="tracking-cargo-info">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="w-5 h-5 text-cyan-700" />
                  <span className="font-bold text-cyan-800">Kargo Bilgisi</span>
                </div>
                <div className="text-sm text-cyan-700 space-y-1">
                  <p>Kargo Firmasi: <span className="font-semibold">{order.cargo_company}</span></p>
                  <p>Takip No: <span className="font-semibold">{order.tracking_number}</span></p>
                  {order.shipped_at && <p>Kargoya Verilme: <span className="font-semibold">{formatDate(order.shipped_at)}</span></p>}
                </div>
                {getCargoTrackingUrl(order.cargo_company, order.tracking_number) && (
                  <a
                    href={getCargoTrackingUrl(order.cargo_company, order.tracking_number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-cyan-700 text-white text-sm font-medium rounded-lg hover:bg-cyan-800 transition-colors"
                    data-testid="tracking-external-link"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Kargo Takip Sayfasina Git</span>
                  </a>
                )}
              </div>
            )}

            {/* Order Details */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Urunler</h3>
                {order.products?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} adet</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity, item.currency + ' ')}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-3 border-t">
                <span className="font-bold text-gray-900">Toplam</span>
                <span className="font-bold text-burgundy-700 text-lg">{formatPrice(order.total_amount, order.currency + ' ')}</span>
              </div>

              {order.shipping_address && (
                <div className="pt-3 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Teslimat Adresi</h3>
                  <p className="text-sm text-gray-700">
                    {order.shipping_address.full_name}<br />
                    {order.shipping_address.address}<br />
                    {order.shipping_address.city} {order.shipping_address.zip_code}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-400 pt-2">Siparis Tarihi: {formatDate(order.created_at)}</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
