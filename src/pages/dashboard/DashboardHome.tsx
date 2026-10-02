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
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Olá, {business.name} 👋</h1>
      <p className="text-slate-500 text-sm mb-8">Aqui está um resumo da sua loja.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="ui-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
            <Package size={14} /> Produtos
          </div>
          <p className="text-3xl font-bold text-slate-900">{productCount ?? '—'}</p>
        </div>
        <div className="ui-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
            <Star size={14} /> Em destaque
          </div>
          <p className="text-3xl font-bold text-slate-900">{featuredCount ?? '—'}</p>
        </div>
        <div className="ui-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
            Estado da loja
          </div>
          <p className="text-lg font-bold text-emerald-600 capitalize">{business.status}</p>
        </div>
      </div>

      <div className="ui-card rounded-xl p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Link da sua loja</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 truncate">
            {storeUrl}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
          <a
            href={`/loja/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            <ExternalLink size={16} />
            Abrir loja
          </a>
        </div>
      </div>
    </div>
  );
}
