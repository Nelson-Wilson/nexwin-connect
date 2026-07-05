import { useEffect, useState } from 'react';
import { Copy, ExternalLink, Package, Star, Check } from 'lucide-react';
import { useBusiness } from '../../hooks/useBusiness';
import { productService } from '../../services/storeServices';

export default function DashboardHome() {
  const { business } = useBusiness();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [featuredCount, setFeaturedCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!business) return;
    productService.listByBusiness(business.id).then((products) => {
      setProductCount(products.length);
      setFeaturedCount(products.filter((p) => p.featured).length);
    });
  }, [business]);

  if (!business) return null;

  const storeUrl = `${window.location.origin}/loja/${business.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-white mb-1">Olá, {business.name} 👋</h1>
      <p className="text-slate-400 text-sm mb-8">Aqui está um resumo da sua loja.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Package size={14} /> Produtos
          </div>
          <p className="text-3xl font-bold text-white">{productCount ?? '—'}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Star size={14} /> Em destaque
          </div>
          <p className="text-3xl font-bold text-white">{featuredCount ?? '—'}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
            Estado da loja
          </div>
          <p className="text-lg font-bold text-emerald-400 capitalize">{business.status}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Link da sua loja</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-300 truncate">
            {storeUrl}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
          <a
            href={`/loja/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            <ExternalLink size={16} />
            Abrir loja
          </a>
        </div>
      </div>
    </div>
  );
}
