import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, CheckCircle, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { reviewsAPI } from '../services/api';
import { toast } from '../hooks/use-toast';

const StarsDisplay = ({ value = 0, size = 4 }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} yıldız`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-${size} h-${size} ${i <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const StarsInput = ({ value, onChange }) => (
  <div className="flex items-center gap-1" data-testid="review-rating-stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange(i)}
        className="p-0.5 transition-transform hover:scale-110"
        data-testid={`rating-star-${i}`}
        aria-label={`${i} yıldız ver`}
      >
        <Star className={`w-8 h-8 ${i <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
      </button>
    ))}
  </div>
);

const formatDate = (d) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
};

const ProductReviews = ({ productId }) => {
  const [data, setData] = useState({ count: 0, average: 0, distribution: {}, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    order_number: '',
    user_email: '',
    user_name: '',
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const load = async () => {
    try {
      setLoading(true);
      const r = await reviewsAPI.getProductReviews(productId);
      setData(r.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ order_number: '', user_email: '', user_name: '', rating: 5, title: '', comment: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.order_number.trim() || !form.user_email.trim() || !form.user_name.trim() || !form.comment.trim()) {
      toast({ title: 'Hata', description: 'Lütfen tüm alanları doldurun', variant: 'destructive' });
      return;
    }
    if (form.comment.trim().length < 5) {
      toast({ title: 'Hata', description: 'Yorum en az 5 karakter olmalı', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await reviewsAPI.create({
        product_id: productId,
        order_number: form.order_number.trim(),
        user_email: form.user_email.trim(),
        user_name: form.user_name.trim(),
        rating: form.rating,
        title: form.title.trim() || undefined,
        comment: form.comment.trim(),
      });
      toast({ title: 'Başarılı', description: 'Yorumunuz kaydedildi. Teşekkür ederiz!' });
      resetForm();
      setShowForm(false);
      load();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Yorum gönderilemedi';
      toast({ title: 'Hata', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const distMax = Math.max(1, ...Object.values(data.distribution || { 1: 1 }));

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8" data-testid="product-reviews-section">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "'Source Serif 4', serif" }}>
          <MessageSquare className="w-6 h-6 text-burgundy-700" />
          Müşteri Yorumları
        </h2>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-burgundy-700 hover:bg-burgundy-800 text-white"
          data-testid="write-review-btn"
        >
          {showForm ? 'Vazgeç' : 'Yorum Yaz'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-burgundy-700 mx-auto" />
        </div>
      ) : (
        <>
          {/* Summary */}
          {data.count > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-gray-200" data-testid="reviews-summary">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-burgundy-700 mb-1" data-testid="review-average">
                  {data.average.toFixed(1)}
                </div>
                <StarsDisplay value={data.average} size={5} />
                <p className="text-sm text-gray-500 mt-2" data-testid="review-count">
                  {data.count} yorum
                </p>
              </div>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((s) => {
                  const cnt = data.distribution?.[String(s)] || 0;
                  const pct = (cnt / distMax) * 100;
                  return (
                    <div key={s} className="flex items-center gap-2 text-sm">
                      <span className="w-4 text-gray-600">{s}</span>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="w-8 text-right text-gray-500">{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 mb-2 bg-cream-50 rounded-lg" data-testid="no-reviews">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Bu ürüne henüz yorum yapılmamış. İlk yorumu sen yap!</p>
            </div>
          )}

          {/* Review Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-burgundy-50 border border-burgundy-100 rounded-lg p-5 mb-8 space-y-4" data-testid="review-form">
              <div className="flex items-start gap-2 text-xs text-burgundy-700 bg-white p-3 rounded">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Sadece bu ürünü satın almış müşterilerimiz yorum yapabilir. Sipariş numaranız ve e-posta adresinizle doğrulama yapılacaktır.</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş No *</label>
                  <input
                    type="text"
                    value={form.order_number}
                    onChange={(e) => setForm({ ...form, order_number: e.target.value.toUpperCase() })}
                    placeholder="ORD-XXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none uppercase"
                    required
                    data-testid="review-order-number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    type="email"
                    value={form.user_email}
                    onChange={(e) => setForm({ ...form, user_email: e.target.value })}
                    placeholder="ornek@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none"
                    required
                    data-testid="review-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adınız *</label>
                <input
                  type="text"
                  value={form.user_name}
                  onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                  placeholder="Adınız Soyadınız"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none"
                  required
                  data-testid="review-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Puanınız *</label>
                <StarsInput value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık (isteğe bağlı)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Yorumunuz için kısa bir başlık"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none"
                  maxLength={120}
                  data-testid="review-title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yorumunuz *</label>
                <textarea
                  rows={4}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 outline-none resize-none"
                  required
                  minLength={5}
                  maxLength={2000}
                  data-testid="review-comment"
                />
                <p className="text-xs text-gray-400 mt-1">{form.comment.length} / 2000 karakter</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => { setShowForm(false); resetForm(); }} variant="outline" className="flex-1">
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-burgundy-700 hover:bg-burgundy-800 text-white"
                  data-testid="submit-review-btn"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor...
                    </span>
                  ) : 'Yorumu Gönder'}
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-5" data-testid="reviews-list">
            {data.reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 pb-5 last:border-b-0" data-testid={`review-item-${r.id}`}>
                <div className="flex items-start justify-between mb-2 gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{r.user_name}</span>
                      {r.verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Doğrulanmış Alıcı
                        </span>
                      )}
                    </div>
                    <StarsDisplay value={r.rating} size={4} />
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                </div>
                {r.title && <p className="font-semibold text-gray-800 mb-1">{r.title}</p>}
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{r.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default ProductReviews;
