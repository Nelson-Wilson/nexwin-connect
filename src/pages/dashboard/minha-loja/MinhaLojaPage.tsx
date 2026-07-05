import { useState } from 'react';
import { Copy, ExternalLink, Check, Loader2, Save } from 'lucide-react';
import { useBusiness } from '../../../hooks/useBusiness';
import { businessService, slugify } from '../../../services/businessService';
import { FormField, inputClass } from '../components/FormField';

export default function MinhaLojaPage() {
  const { business, updateBusiness } = useBusiness();
  const [slug, setSlug] = useState(business?.slug ?? '');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  if (!business) return null;

  const storeUrl = `${window.location.origin}/loja/${business.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSlug = async () => {
    setError('');
    const clean = slugify(slug);
    if (!clean) return setError('Indica um endereço válido.');
    if (clean === business.slug) return;
    setSaving(true);
    try {
      const available = await businessService.isSlugAvailable(clean, business.id);
      if (!available) {
        setError('Este endereço já está em uso.');
        setSaving(false);
        return;
      }
      await updateBusiness({ slug: clean });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-1">Minha Loja</h1>
      <p className="text-sm text-slate-400 mb-8">O endereço público e o estado da tua loja.</p>

      <div className="glass-card rounded-xl p-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Link da loja</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-300 truncate">
            {storeUrl}
          </div>
          <button onClick={handleCopy} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors">
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <a href={`/loja/${business.slug}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors">
            <ExternalLink size={16} />
            Abrir loja
          </a>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Alterar endereço</p>
        <FormField label="Endereço da loja">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors mb-1">
            <span className="pl-4 text-sm text-slate-500 whitespace-nowrap">nexstore.app/loja/</span>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-transparent px-2 py-2.5 text-sm text-white focus:outline-none" />
          </div>
        </FormField>
        {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
        <div className="flex items-center gap-3 mt-3">
          <button onClick={handleSaveSlug} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm rounded-lg px-4 py-2.5 transition-colors">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Guardar
          </button>
          {saved && <span className="text-sm text-emerald-400 font-semibold">Guardado ✓</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Estado</p>
          <p className="text-lg font-bold text-emerald-400 capitalize">{business.status}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Plano</p>
          <p className="text-lg font-bold text-white capitalize">{business.plan === 'pro' ? 'Pro' : 'Grátis'}</p>
        </div>
      </div>
    </div>
  );
}
