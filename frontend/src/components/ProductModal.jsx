import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { productsAPI } from '../services/api';
import { toast } from '../hooks/use-toast';
import { countries } from '../data/mock';

const ProductModal = ({ isOpen, onClose, product, categories, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    description: '',
    category: '',
    category_name: '',
    images: [],
    in_stock: true,
    featured: false,
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        short_name: product.short_name || '',
        description: product.description || '',
        category: product.category || '',
        category_name: product.category_name || '',
        images: product.images || [],
        in_stock: product.in_stock ?? true,
        featured: product.featured ?? false,
      });
      setPrices(product.prices || {});
      if (product.images && product.images.length > 0) {
        setImageUrl(product.images[0]);
      }
    } else {
      // Initialize default prices for new product
      const defaultPrices = {};
      countries.forEach(country => {
        defaultPrices[country.code] = {
          price: 0,
          currency: country.currency,
          symbol: country.symbol
        };
      });
      setPrices(defaultPrices);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const category = categories.find(c => c.id === formData.category);
      
      const productData = {
        ...formData,
        category_name: category?.name || '',
        images: imageUrl ? [imageUrl] : [],
        prices: prices,
      };

      if (product) {
        await productsAPI.update(product.id, productData);
        toast({
          title: 'Başarılı',
          description: 'Ürün güncellendi',
        });
      } else {
        await productsAPI.create(productData);
        toast({
          title: 'Başarılı',
          description: 'Ürün oluşturuldu',
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Hata',
        description: error.response?.data?.detail || 'İşlem başarısız',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (countryCode, value) => {
    setPrices(prev => ({
      ...prev,
      [countryCode]: {
        ...prev[countryCode],
        price: parseFloat(value) || 0
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-burgundy-700 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-burgundy-600 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Temel Bilgiler</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Zikra Zikirmatik - Altın Kalp"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Ad</label>
                <Input
                  value={formData.short_name}
                  onChange={(e) => setFormData({...formData, short_name: e.target.value})}
                  placeholder="Altın Kalp"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ürün açıklamasını girin..."
                rows={3}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                  className="w-4 h-4 text-burgundy-600 rounded"
                />
                <span className="text-sm text-gray-700">Stokta</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 text-gold-600 rounded"
                />
                <span className="text-sm text-gray-700">Öne Çıkar</span>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Ülke Bazlı Fiyatlandırma</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {countries.slice(0, 12).map(country => (
                <div key={country.code} className="border rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {country.flag} {country.name}
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-sm">{country.symbol}</span>
                    <Input
                      type="number"
                      value={prices[country.code]?.price || 0}
                      onChange={(e) => handlePriceChange(country.code, e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-xs text-gray-500">{country.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 border-t pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={loading} className="bg-burgundy-700 hover:bg-burgundy-800">
              {loading ? 'Kaydediliyor...' : (product ? 'Güncelle' : 'Oluştur')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
