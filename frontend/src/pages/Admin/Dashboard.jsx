import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Star, Plus, Edit, Trash2, LogOut } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

  useEffect(() => {
    // Check if logged in
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
      toast({
        title: 'Hata',
        description: 'Veriler yüklenirken hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      await productsAPI.toggleFeatured(productId, !currentStatus);
      toast({
        title: 'Başarılı',
        description: !currentStatus ? 'Ürün öne çıkarıldı' : 'Ürün öne çıkarmadan kaldırıldı',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Hata',
        description: error.response?.data?.detail || 'İşlem başarısız',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-burgundy-600">
                <img
                  src="https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/99jr70kx_logo.jpeg"
                  alt="Zikra Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-burgundy-900">Zikra Admin</h1>
                <p className="text-sm text-gray-600">Hoş geldiniz, {adminUser.name}</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Toplam Ürün</h3>
            <p className="text-3xl font-bold text-burgundy-700">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Öne Çıkan</h3>
            <p className="text-3xl font-bold text-gold-600">{featuredProducts.length} / 2</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Kategoriler</h3>
            <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Ürünler</h2>
              <Button className="bg-burgundy-700 hover:bg-burgundy-800 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Yeni Ürün</span>
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category_name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {product.featured && (
                          <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-full flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-gold-700" />
                            <span>Öne Çıkan</span>
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.in_stock ? 'Stokta' : 'Stok Yok'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleToggleFeatured(product.id, product.featured)}
                      variant={product.featured ? 'default' : 'outline'}
                      size="sm"
                      className={product.featured ? 'bg-gold-600 hover:bg-gold-700' : ''}
                    >
                      <Star className={`w-4 h-4 ${product.featured ? 'fill-white' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
