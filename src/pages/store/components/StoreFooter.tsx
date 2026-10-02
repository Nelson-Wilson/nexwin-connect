import { Store as StoreIcon, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PLATFORM_NAME } from '../../../config/platform';

export default function StoreFooter() {
  const { business, accent, categories, whatsappLink } = useStore();
  const wa = whatsappLink('Olá!');

  return (
    <footer className="bg-white border-t border-slate-100 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                <StoreIcon size={15} />
              </span>
              <span className="font-display font-black text-slate-900">{business.name}</span>
            </div>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              {business.description || `O catálogo digital de ${business.name}. Encomende diretamente pelo WhatsApp!`}
            </p>
            <div className="flex items-center gap-2 mt-4">
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 flex items-center justify-center text-slate-500 transition-all">
                  <MessageCircle size={14} />
                </a>
              )}
              {business.instagram && (
                <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white hover:bg-pink-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center text-slate-500 transition-all">
                  <Instagram size={14} />
                </a>
              )}
              {business.facebook && (
                <a href={business.facebook.startsWith('http') ? business.facebook : `https://${business.facebook}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white hover:bg-blue-600 hover:text-white border border-slate-200 flex items-center justify-center text-slate-500 transition-all">
                  <Facebook size={14} />
                </a>
              )}
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-600 mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-600 mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {business.whatsapp && <li>{business.whatsapp}</li>}
              {business.email && <li>{business.email}</li>}
              {business.address && <li>{business.address}</li>}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} <strong className="text-slate-600">{business.name}</strong>. Todos os direitos reservados.</span>
          <span>Feito com {PLATFORM_NAME}</span>
        </div>
      </div>
    </footer>
  );
}
