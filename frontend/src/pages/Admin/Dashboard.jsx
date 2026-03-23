import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, ordersAPI } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Star, Plus, Edit, Trash2, LogOut, Package, ShoppingCart, Truck, Eye, X, Search, ExternalLink, Printer } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import ProductModal from '../../components/ProductModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getCargoTrackingUrl, CARGO_COMPANIES } from '../../utils/cargo';
import ShippingLabel from '../../components/ShippingLabel';
import { formatPrice } from '../../utils/format';

const STATUS_MAP = {
  pending: { label: 'Beklemede', color: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Odendi', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Hazirlaniyor', color: 'bg-purple-100 text-purple-700' },
  shipped: { label: 'Kargoda', color: 'bg-cyan-100 text-cyan-700' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Iptal', color: 'bg-red-100 text-red-700' },
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingOrder, setShippingOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [cargoCompany, setCargoCompany] = useState('');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [labelOrder, setLabelOrder] = useState(null);

  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast({ title: 'Hata', description: 'Veriler yuklenirken hata olustu', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (status) => {
    try {
      const params = {};
      if (status) params.status = status;
      const [ordersRes, statsRes] = await Promise.all([
        ordersAPI.getAll(params),
        ordersAPI.getStats(),
      ]);
      setOrders(ordersRes.data.orders || []);
      setOrderStats(statsRes.data);
    } catch (error) {
      toast({ title: 'Hata', description: 'Siparisler yuklenemedi', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders(orderStatusFilter);
    }
  }, [activeTab, orderStatusFilter]);

  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      await productsAPI.toggleFeatured(productId, !currentStatus);
      toast({ title: 'Basarili', description: !currentStatus ? 'Urun one cikarildi' : 'Urun one cikarmadan kaldirildi' });
      loadData();
    } catch (error) {
      toast({ title: 'Hata', description: error.response?.data?.detail || 'Islem basarisiz', variant: 'destructive' });
    }
  };

  const handleEditProduct = (product) => { setSelectedProduct(product); setShowProductModal(true); };
  const handleNewProduct = () => { setSelectedProduct(null); setShowProductModal(true); };
  const handleDeleteClick = (product) => { setProductToDelete(product); setShowDeleteDialog(true); };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await productsAPI.delete(productToDelete.id);
      toast({ title: 'Basarili', description: 'Urun silindi' });
      setShowDeleteDialog(false);
      setProductToDelete(null);
      loadData();
    } catch (error) {
      toast({ title: 'Hata', description: error.response?.data?.detail || 'Urun silinemedi', variant: 'destructive' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast({ title: 'Basarili', description: 'Siparis durumu guncellendi' });
      loadOrders(orderStatusFilter);
    } catch (error) {
      toast({ title: 'Hata', description: 'Durum guncellenemedi', variant: 'destructive' });
    }
  };

  const handleShippingSubmit = async () => {
    if (!trackingNumber.trim() || !cargoCompany.trim()) {
      toast({ title: 'Hata', description: 'Kargo firmasi ve takip numarasi gerekli', variant: 'destructive' });
      return;
    }
    setShippingLoading(true);
    try {
      await ordersAPI.updateShipping(shippingOrder.id, {
        tracking_number: trackingNumber,
        cargo_company: cargoCompany,
      });
      toast({ title: 'Basarili', description: 'Kargo bilgisi eklendi ve bildirim gonderildi' });
      setShowShippingModal(false);
      setTrackingNumber('');
      setCargoCompany('');
      setShippingOrder(null);
      loadOrders(orderStatusFilter);
    } catch (error) {
      toast({ title: 'Hata', description: 'Kargo bilgisi eklenemedi', variant: 'destructive' });
    } finally {
      setShippingLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700 mx-auto"></div>
      </div>
    );
  }

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-burgundy-600">
                <img src="https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/99jr70kx_logo.jpeg" alt="Zikra Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-burgundy-900">Zikra Admin</h1>
                <p className="text-sm text-gray-600">Hos geldiniz, {adminUser.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => window.open('/', '_blank')} variant="outline" className="flex items-center space-x-2">
                <Package className="w-4 h-4" /><span className="hidden sm:inline">Siteyi Goruntule</span>
              </Button>
              <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Cikis</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-white rounded-lg shadow p-1" data-testid="admin-tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-burgundy-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            data-testid="tab-products"
          >
            <Package className="w-4 h-4" /><span>Urunler</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-burgundy-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            data-testid="tab-orders"
          >
            <ShoppingCart className="w-4 h-4" /><span>Siparisler</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'products' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Toplam Urun</h3>
                <p className="text-3xl font-bold text-burgundy-700">{products.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">One Cikan</h3>
                <p className="text-3xl font-bold text-gold-600">{featuredProducts.length} / 2</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Kategoriler</h3>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Urunler</h2>
                  <Button onClick={handleNewProduct} className="bg-burgundy-700 hover:bg-burgundy-800 flex items-center space-x-2" data-testid="new-product-btn">
                    <Plus className="w-4 h-4" /><span>Yeni Urun</span>
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Henuz urun yok</p>
                    <Button onClick={handleNewProduct} className="bg-burgundy-700 hover:bg-burgundy-800">Ilk Urunu Ekle</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4 flex-1">
                          <img src={product.images[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.category_name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {product.featured && (
                                <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-full flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-gold-700" /><span>One Cikan</span>
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.in_stock ? 'Stokta' : 'Stok Yok'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button onClick={() => handleToggleFeatured(product.id, product.featured)} variant={product.featured ? 'default' : 'outline'} size="sm" className={product.featured ? 'bg-gold-600 hover:bg-gold-700' : ''}>
                            <Star className={`w-4 h-4 ${product.featured ? 'fill-white' : ''}`} />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteClick(product)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {/* Order Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Toplam', value: orderStats.total || 0, color: 'text-gray-900' },
                { label: 'Beklemede', value: orderStats.pending || 0, color: 'text-amber-600' },
                { label: 'Kargoda', value: orderStats.shipped || 0, color: 'text-cyan-600' },
                { label: 'Teslim', value: orderStats.delivered || 0, color: 'text-green-600' },
                { label: 'Iptal', value: orderStats.cancelled || 0, color: 'text-red-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">{stat.label}</h3>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600 mr-2">Filtre:</span>
                {[
                  { value: '', label: 'Tumu' },
                  { value: 'pending', label: 'Beklemede' },
                  { value: 'shipped', label: 'Kargoda' },
                  { value: 'delivered', label: 'Teslim Edildi' },
                  { value: 'cancelled', label: 'Iptal' },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setOrderStatusFilter(f.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${orderStatusFilter === f.value ? 'bg-burgundy-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    data-testid={`filter-${f.value || 'all'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Siparisler</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Henuz siparis yok</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors" data-testid={`order-row-${order.id}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-900 text-sm" data-testid={`order-num-${order.id}`}>{order.order_number}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_MAP[order.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                              {STATUS_MAP[order.status]?.label || order.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.shipping_address?.full_name} - {order.shipping_address?.city}</p>
                            <p className="font-semibold text-burgundy-700">{formatPrice(order.total_amount, order.currency + ' ')}</p>
                            <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                            {order.tracking_number && (
                              <p className="text-xs text-cyan-700">
                                <Truck className="w-3 h-3 inline mr-1" />
                                {order.cargo_company} - {order.tracking_number}
                              </p>
                            )}
                            {order.customer_email && (
                              <p className="text-xs text-gray-400">{order.customer_email}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            data-testid={`view-order-${order.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center space-x-1"
                              onClick={() => { setShippingOrder(order); setShowShippingModal(true); }}
                              data-testid={`ship-order-${order.id}`}
                            >
                              <Truck className="w-4 h-4" /><span className="hidden sm:inline">Kargola</span>
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              data-testid={`deliver-order-${order.id}`}
                            >
                              Teslim Edildi
                            </Button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                              data-testid={`cancel-order-${order.id}`}
                            >
                              Iptal
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Order Detail Expand */}
                      {selectedOrder?.id === order.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4" data-testid={`order-detail-${order.id}`}>
                          <h4 className="font-semibold text-gray-800 mb-3">Siparis Detayi</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-2">Urunler</p>
                              {order.products?.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm py-1">
                                  <span>{item.name} x{item.quantity}</span>
                                  <span className="font-medium">{formatPrice(item.price * item.quantity, item.currency + ' ')}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-2">Teslimat Adresi</p>
                              <div className="text-sm text-gray-700">
                                <p className="font-medium">{order.shipping_address?.full_name}</p>
                                <p>{order.shipping_address?.address}</p>
                                <p>{order.shipping_address?.city} {order.shipping_address?.zip_code}</p>
                                <p>{order.shipping_address?.phone}</p>
                              </div>
                            </div>
                          </div>
                          {order.tracking_number && (
                            <div className="mt-3 p-3 bg-cyan-50 rounded-lg">
                              <p className="text-sm font-medium text-cyan-800">
                                <Truck className="w-4 h-4 inline mr-1" />
                                Kargo: {order.cargo_company} | Takip No: {order.tracking_number}
                              </p>
                              {order.shipped_at && <p className="text-xs text-cyan-600 mt-1">Kargoya verilme: {formatDate(order.shipped_at)}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                {getCargoTrackingUrl(order.cargo_company, order.tracking_number) && (
                                  <a
                                    href={getCargoTrackingUrl(order.cargo_company, order.tracking_number)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-cyan-700 text-white text-xs font-medium rounded-lg hover:bg-cyan-800 transition-colors"
                                    data-testid={`tracking-link-${order.id}`}
                                  >
                                    <ExternalLink className="w-3 h-3" /><span>Kargo Takip</span>
                                  </a>
                                )}
                                <button
                                  onClick={() => setLabelOrder(order)}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                  data-testid={`print-label-${order.id}`}
                                >
                                  <Printer className="w-3 h-3" /><span>Kargo Etiketi</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="shipping-modal">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-cyan-600" />
                <h2 className="text-lg font-bold text-gray-900">Kargo Bilgisi</h2>
              </div>
              <button onClick={() => { setShowShippingModal(false); setShippingOrder(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Siparis: <span className="font-bold">{shippingOrder?.order_number}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kargo Firmasi *</label>
                <select
                  value={cargoCompany}
                  onChange={(e) => setCargoCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  data-testid="input-cargo-company"
                >
                  <option value="">Secin...</option>
                  {CARGO_COMPANIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Takip Numarasi *</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="Kargo takip numarasini girin"
                  data-testid="input-tracking-number"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  Kargo bilgisi girildiginde siparis durumu otomatik olarak "Kargoda" olarak guncellenecek
                  {shippingOrder?.customer_email && ' ve musteriye e-posta bildirimi gonderilecektir.'}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => { setShowShippingModal(false); setShippingOrder(null); }}
                  variant="outline"
                  className="flex-1"
                >
                  Iptal
                </Button>
                <Button
                  onClick={handleShippingSubmit}
                  disabled={shippingLoading}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                  data-testid="submit-shipping"
                >
                  {shippingLoading ? 'Gonderiliyor...' : 'Kargoya Ver'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modals */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => { setShowProductModal(false); setSelectedProduct(null); }}
        product={selectedProduct}
        categories={categories}
        onSuccess={loadData}
      />
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => { setShowDeleteDialog(false); setProductToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        title="Urunu Sil"
        message={`"${productToDelete?.name}" adli urunu silmek istediginizden emin misiniz? Bu islem geri alinamaz.`}
        loading={deleteLoading}
      />

      {/* Shipping Label Modal */}
      {labelOrder && (
        <ShippingLabel order={labelOrder} onClose={() => setLabelOrder(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
