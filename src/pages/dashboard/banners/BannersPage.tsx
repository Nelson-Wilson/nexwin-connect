import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useBusiness } from '../../../hooks/useBusiness';
import { bannerService } from '../../../services/storeServices';
import type { StoreBanner } from '../../../models/marketing.model';
import { PageHeader, EmptyState } from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import { FormField, inputClass } from '../components/FormField';

export default function BannersPage() {
  const { business } = useBusiness();
  const [banners, setBanners] = useState<StoreBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StoreBanner | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<StoreBanner | null>(null);

  const load = async () => {
    if (!business) return;
    setLoading(true);
    const list = await bannerService.listByBusiness(business.id);
    setBanners(list.sort((a, b) => a.order - b.order));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  if (!business) return null;

  const handleDelete = async () => {
    if (!toDelete) return;
    await bannerService.remove(toDelete.id);
    setToDelete(null);
    load();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= banners.length) return;
    const a = banners[idx];
    const b = banners[target];
    await Promise.all([
      bannerService.update(a.id, { order: b.order }),
      bannerService.update(b.id, { order: a.order }),
    ]);
    load();
  };

  const toggleActive = async (banner: StoreBanner) => {
    await bannerService.update(banner.id, { active: !banner.active });
    load();
  };

  return (
    <div className="p-8 max-w-4xl">
      <PageHeader
        title="Banners"
        description="Destaques que aparecem no topo da tua loja."
        actionLabel="Novo banner"
        onAction={() => setEditing('new')}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-500" size={24} /></div>
      ) : banners.length === 0 ? (
        <EmptyState icon={<ImageIcon size={32} />} title="Ainda não tens banners" description="Cria o primeiro banner promocional da tua loja." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((banner, idx) => (
            <div key={banner.id} className="glass-card rounded-xl overflow-hidden">
              <div className="aspect-video bg-white/5">
                {banner.image && <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-white">{banner.title}</p>
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shrink-0 ${
                      banner.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                    }`}
                  >
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"><ArrowUp size={13} /></button>
                  <button onClick={() => move(idx, 1)} disabled={idx === banners.length - 1} className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"><ArrowDown size={13} /></button>
                  <button onClick={() => setEditing(banner)} className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => setToDelete(banner)} className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <BannerFormModal
          businessId={business.id}
          banner={editing === 'new' ? null : editing}
          nextOrder={banners.length}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar banner"
          message={`Tens a certeza que queres eliminar "${toDelete.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}

function BannerFormModal({
  businessId,
  banner,
  nextOrder,
  onClose,
  onSaved,
}: {
  businessId: string;
  banner: StoreBanner | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [id] = useState(banner?.id ?? bannerService.newId());
  const [title, setTitle] = useState(banner?.title ?? '');
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? '');
  const [link, setLink] = useState(banner?.link ?? '');
  const [images, setImages] = useState<string[]>(banner?.image ? [banner.image] : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) return setError('Indica o título do banner.');
    if (images.length === 0) return setError('Adiciona uma imagem para o banner.');
    setSaving(true);
    try {
      if (banner) {
        await bannerService.update(id, { title: title.trim(), subtitle: subtitle.trim() || undefined, link: link.trim() || undefined, image: images[0] });
      } else {
        await bannerService.create({
          id,
          businessId,
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          link: link.trim() || undefined,
          image: images[0],
          active: true,
          order: nextOrder,
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
    <Modal title={banner ? 'Editar banner' : 'Novo banner'} onClose={onClose}>
      <div className="space-y-4">
        <FormField label="Imagem" hint="Formato paisagem (16:9) fica melhor.">
          <ImageUploader businessId={businessId} context={`banners/${id}`} images={images} onChange={setImages} maxImages={1} aspect="aspect-video" />
        </FormField>
        <FormField label="Título">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Promoção de Verão" className={inputClass} />
        </FormField>
        <FormField label="Subtítulo (opcional)">
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Ex: Até 30% de desconto" className={inputClass} />
        </FormField>
        <FormField label="Link (opcional)">
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className={inputClass} />
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
