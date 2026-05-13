import React, { useEffect, useState } from 'react';
import { MessageSquare, Star, CheckCircle, EyeOff, Eye, Trash2, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { reviewsAPI } from '../services/api';
import { toast } from '../hooks/use-toast';
import ConfirmDialog from './ConfirmDialog';

const StarsRow = ({ value }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const ReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'approved' | 'hidden'
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const load = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'approved') params.approved = true;
      if (filter === 'hidden') params.approved = false;
      const r = await reviewsAPI.getAll(params);
      setReviews(r.data || []);
    } catch {
      toast({ title: 'Hata', description: 'Yorumlar yüklenemedi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (rev) => {
    try {
      await reviewsAPI.setApproval(rev.id, !rev.approved);
      toast({ title: 'Başarılı', description: !rev.approved ? 'Yorum yayınlandı' : 'Yorum gizlendi' });
      load();
    } catch {
      toast({ title: 'Hata', description: 'İşlem başarısız', variant: 'destructive' });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await reviewsAPI.delete(deleting.id);
      toast({ title: 'Başarılı', description: 'Yorum silindi' });
      setDeleting(null);
      load();
    } catch {
      toast({ title: 'Hata', description: 'Silinemedi', variant: 'destructive' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div data-testid="reviews-tab">
      {/* Filter */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600 mr-2">Filtre:</span>
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'approved', label: 'Yayında' },
            { value: 'hidden', label: 'Gizli' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f.value ? 'bg-burgundy-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              data-testid={`review-filter-${f.value}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-burgundy-700" />
            Ürün Yorumları
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-burgundy-700 mx-auto"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Henüz yorum yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className={`border rounded-lg p-4 ${r.approved ? 'border-gray-200' : 'border-amber-200 bg-amber-50/40'}`}
                  data-testid={`admin-review-${r.id}`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-gray-900">{r.user_name}</span>
                        {r.verified_purchase && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Doğrulanmış
                          </span>
                        )}
                        {!r.approved && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            <EyeOff className="w-3 h-3" /> Gizli
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <StarsRow value={r.rating} />
                        <span className="text-xs text-gray-500">{formatDate(r.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Sipariş:</span> {r.order_number} • <span className="font-medium">E-posta:</span> {r.user_email}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Ürün ID:</span> {r.product_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApproval(r)}
                        data-testid={`toggle-review-${r.id}`}
                      >
                        {r.approved ? (
                          <><EyeOff className="w-4 h-4 mr-1" />Gizle</>
                        ) : (
                          <><Eye className="w-4 h-4 mr-1" />Yayınla</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setDeleting(r)}
                        data-testid={`delete-review-${r.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {r.title && <p className="font-semibold text-gray-800 mb-1">{r.title}</p>}
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Yorumu Sil"
        message={`"${deleting?.user_name}" tarafından yazılan yorumu silmek istediğinize emin misiniz?`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ReviewsTab;
