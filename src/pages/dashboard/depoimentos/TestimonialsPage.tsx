import { useEffect, useState } from 'react';
import { Star, Pencil, Trash2, MessageSquareQuote, Loader2 } from 'lucide-react';
import { useBusiness } from '../../../hooks/useBusiness';
import { testimonialService } from '../../../services/storeServices';
import type { StoreTestimonial } from '../../../models/marketing.model';
import { PageHeader, EmptyState } from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import { FormField, inputClass } from '../components/FormField';

export default function TestimonialsPage() {
  const { business } = useBusiness();
  const [items, setItems] = useState<StoreTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StoreTestimonial | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<StoreTestimonial | null>(null);

  const load = async () => {
    if (!business) return;
    setLoading(true);
    setItems(await testimonialService.listByBusiness(business.id));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  if (!business) return null;

  const handleDelete = async () => {
    if (!toDelete) return;
    await testimonialService.remove(toDelete.id);
    setToDelete(null);
    load();
  };

  return (
    <div className="p-8 max-w-4xl">
      <PageHeader
        title="Depoimentos"
        description="Opiniões de clientes, mostradas na tua loja pública."
        actionLabel="Novo depoimento"
        onAction={() => setEditing('new')}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-500" size={24} /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={<MessageSquareQuote size={32} />} title="Ainda não tens depoimentos" description="Adiciona a opinião de um cliente satisfeito." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
                  {t.photo && <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  {t.role && <p className="text-xs text-slate-500 truncate">{t.role}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing(t)} className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => setToDelete(t)} className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                ))}
              </div>
              <p className="text-sm text-slate-300">{t.comment}</p>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <TestimonialFormModal
          businessId={business.id}
          testimonial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar depoimento"
          message={`Tens a certeza que queres eliminar o depoimento de "${toDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}

function TestimonialFormModal({
  businessId,
  testimonial,
  onClose,
  onSaved,
}: {
  businessId: string;
  testimonial: StoreTestimonial | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [id] = useState(testimonial?.id ?? testimonialService.newId());
  const [name, setName] = useState(testimonial?.name ?? '');
  const [role, setRole] = useState(testimonial?.role ?? '');
  const [comment, setComment] = useState(testimonial?.comment ?? '');
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [photo, setPhoto] = useState<string[]>(testimonial?.photo ? [testimonial.photo] : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return setError('Indica o nome do cliente.');
    if (!comment.trim()) return setError('Escreve o depoimento.');
    setSaving(true);
    try {
      if (testimonial) {
        await testimonialService.update(id, { name: name.trim(), role: role.trim() || undefined, comment: comment.trim(), rating, photo: photo[0] });
      } else {
        await testimonialService.create({
          id,
          businessId,
          name: name.trim(),
          role: role.trim() || undefined,
          comment: comment.trim(),
          rating,
          photo: photo[0],
          createdAt: new Date().toISOString(),
        });
      }
      onSaved();
    } catch (err: any) {
      setError(err.message ?? 'Não foi possível guardar.');
      setSaving(false);
    }
  };

  return (
    <Modal title={testimonial ? 'Editar depoimento' : 'Novo depoimento'} onClose={onClose}>
      <div className="space-y-4">
        <FormField label="Foto (opcional)">
          <div className="w-20">
            <ImageUploader businessId={businessId} context={`testimonials/${id}`} images={photo} onChange={setPhoto} maxImages={1} />
          </div>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nome">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do cliente" className={inputClass} />
          </FormField>
          <FormField label="Ocupação (opcional)">
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Cliente fiel" className={inputClass} />
          </FormField>
        </div>
        <FormField label="Classificação">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)}>
                <Star size={22} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
              </button>
            ))}
          </div>
        </FormField>
        <FormField label="Depoimento">
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="O que o cliente disse..." className={`${inputClass} resize-none`} />
        </FormField>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-colors flex items-center gap-2">
            {saving && <Loader2 size={14} className="animate-spin" />}
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
