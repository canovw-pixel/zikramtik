import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Ticket, X, Percent, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { couponsAPI } from '../services/api';
import { toast } from '../hooks/use-toast';
import ConfirmDialog from './ConfirmDialog';

const emptyForm = {
  code: '',
  discount_type: 'percent',
  discount_value: 10,
  min_order_amount: 0,
  max_discount: '',
  usage_limit: '',
  valid_until: '',
  active: true,
  description: '',
};

const CouponsTab = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const r = await couponsAPI.getAll();
      setCoupons(r.data || []);
    } catch {
      toast({ title: 'Hata', description: 'Kuponlar yuklenemedi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      min_order_amount: c.min_order_amount || 0,
      max_discount: c.max_discount ?? '',
      usage_limit: c.usage_limit ?? '',
      valid_until: c.valid_until ? c.valid_until.slice(0, 10) : '',
      active: c.active,
      description: c.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast({ title: 'Hata', description: 'Kupon kodu gerekli', variant: 'destructive' });
      return;
    }
    if (form.discount_value <= 0) {
      toast({ title: 'Hata', description: 'Indirim degeri 0 dan buyuk olmali', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        max_discount: form.max_discount === '' ? null : parseFloat(form.max_discount),
        usage_limit: form.usage_limit === '' ? null : parseInt(form.usage_limit, 10),
        valid_until: form.valid_until ? new Date(form.valid_until + 'T23:59:59').toISOString() : null,
        active: form.active,
        description: form.description || null,
      };
      if (editing) {
        // Don't allow code change on update
        delete payload.code;
        await couponsAPI.update(editing.id, payload);
        toast({ title: 'Basarili', description: 'Kupon guncellendi' });
      } else {
        await couponsAPI.create(payload);
        toast({ title: 'Basarili', description: 'Kupon olusturuldu' });
      }
      setShowModal(false);
      load();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Islem basarisiz';
      toast({ title: 'Hata', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (c) => {
    setDeleting(c);
    setShowDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await couponsAPI.delete(deleting.id);
      toast({ title: 'Basarili', description: 'Kupon silindi' });
      setShowDelete(false);
      setDeleting(null);
      load();
    } catch {
      toast({ title: 'Hata', description: 'Silinemedi', variant: 'destructive' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleActive = async (c) => {
    try {
      await couponsAPI.update(c.id, { active: !c.active });
      toast({ title: 'Basarili', description: !c.active ? 'Kupon aktif edildi' : 'Kupon pasif edildi' });
      load();
    } catch {
      toast({ title: 'Hata', description: 'Guncellenemedi', variant: 'destructive' });
    }
  };

  const formatExpiry = (iso) => {
    if (!iso) return 'Sinirsiz';
    try {
      return new Date(iso).toLocaleDateString('tr-TR');
    } catch {
      return iso;
    }
  };

  return (
    <div data-testid="coupons-tab">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-burgundy-700" />
              Kuponlar / Indirim Kodlari
            </h2>
            <Button onClick={openNew} className="bg-burgundy-700 hover:bg-burgundy-800 flex items-center space-x-2" data-testid="new-coupon-btn">
              <Plus className="w-4 h-4" /><span>Yeni Kupon</span>
            </Button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-burgundy-700 mx-auto"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Henuz kupon yok</p>
              <Button onClick={openNew} className="bg-burgundy-700 hover:bg-burgundy-800">Ilk Kuponu Olustur</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  data-testid={`coupon-row-${c.code}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${c.active ? 'bg-burgundy-100' : 'bg-gray-100'}`}>
                      {c.discount_type === 'percent' ? (
                        <Percent className={`w-6 h-6 ${c.active ? 'text-burgundy-700' : 'text-gray-400'}`} />
                      ) : (
                        <Tag className={`w-6 h-6 ${c.active ? 'text-burgundy-700' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg text-gray-900">{c.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.active ? 'Aktif' : 'Pasif'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-burgundy-50 text-burgundy-700">
                          {c.discount_type === 'percent' ? `%${c.discount_value} indirim` : `${c.discount_value} TL indirim`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 space-x-3">
                        {c.min_order_amount > 0 && <span>Min: {c.min_order_amount} TL</span>}
                        {c.usage_limit != null && <span>Kullanim: {c.used_count}/{c.usage_limit}</span>}
                        {c.usage_limit == null && <span>Kullanim: {c.used_count}</span>}
                        <span>Bitis: {formatExpiry(c.valid_until)}</span>
                      </div>
                      {c.description && <p className="text-xs text-gray-600 mt-1 italic">{c.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => toggleActive(c)}
                      variant="outline"
                      size="sm"
                      data-testid={`toggle-coupon-${c.code}`}
                    >
                      {c.active ? 'Pasif Yap' : 'Aktif Yap'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(c)} data-testid={`edit-coupon-${c.code}`}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteClick(c)} data-testid={`delete-coupon-${c.code}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="coupon-modal">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Kuponu Duzenle' : 'Yeni Kupon'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kupon Kodu *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  disabled={!!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg uppercase focus:ring-2 focus:ring-burgundy-500 disabled:bg-gray-100"
                  placeholder="WELCOME10"
                  required
                  data-testid="coupon-code-input"
                />
                {editing && <p className="text-xs text-gray-500 mt-1">Kod degistirilemez</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tur *</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                    data-testid="coupon-type-select"
                  >
                    <option value="percent">Yuzde (%)</option>
                    <option value="fixed">Sabit Tutar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deger * {form.discount_type === 'percent' ? '(%)' : '(TL)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                    required
                    data-testid="coupon-value-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Sepet (TL)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.min_order_amount}
                    onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                    data-testid="coupon-min-input"
                  />
                </div>
                {form.discount_type === 'percent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Indirim (TL)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.max_discount}
                      onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                      placeholder="Sinirsiz"
                      data-testid="coupon-max-input"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kullanim Limiti</label>
                  <input
                    type="number"
                    min="1"
                    value={form.usage_limit}
                    onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                    placeholder="Sinirsiz"
                    data-testid="coupon-limit-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanim Tarihi</label>
                  <input
                    type="date"
                    value={form.valid_until}
                    onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                    data-testid="coupon-expiry-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
                  placeholder="Hosgeldin indirimi"
                  data-testid="coupon-description-input"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-burgundy-700"
                  data-testid="coupon-active-checkbox"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">Aktif</label>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                  Iptal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-burgundy-700 hover:bg-burgundy-800 text-white disabled:opacity-50"
                  data-testid="save-coupon-btn"
                >
                  {saving ? 'Kaydediliyor...' : (editing ? 'Guncelle' : 'Olustur')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleting(null); }}
        onConfirm={handleDeleteConfirm}
        title="Kuponu Sil"
        message={`"${deleting?.code}" kuponunu silmek istediginizden emin misiniz?`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default CouponsTab;
