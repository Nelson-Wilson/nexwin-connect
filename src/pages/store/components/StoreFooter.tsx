import { Store as StoreIcon, Instagram, Facebook, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PLATFORM_NAME } from '../../../config/platform';

export default function StoreFooter() {
  const { business, accent, categories, whatsappLink } = useStore();
  const wa = whatsappLink('Olá!');

  return (
    <footer className="border-t border-slate-200 bg-[#071a36] pt-14 pb-8 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg" style={{ backgroundColor: accent }}>
                <StoreIcon size={16} />
              </span>
              <span className="text-xl font-extrabold tracking-[-0.04em] text-white">{business.name}</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-300">
              {business.description || `O catálogo digital de ${business.name}. Encomende diretamente pelo WhatsApp.`}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white transition-opacity hover:opacity-90">
                  <MessageCircle size={14} />
                </a>
              )}
              {business.instagram && (
                <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-200 transition-colors hover:bg-pink-600 hover:text-white">
                  <Instagram size={14} />
                </a>
              )}
              {business.facebook && (
                <a href={business.facebook.startsWith('http') ? business.facebook : `https://${business.facebook}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-200 transition-colors hover:bg-blue-600 hover:text-white">
                  <Facebook size={14} />
                </a>
              )}
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Categorias</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.id} className="flex items-center gap-2">
                    <ArrowUpRight size={12} className="text-blue-300" /> {c.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Contato</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {business.whatsapp && <li>{business.whatsapp}</li>}
              {business.email && <li>{business.email}</li>}
              {business.address && <li>{business.address}</li>}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <span>© {new Date().getFullYear()} <strong className="text-slate-200">{business.name}</strong>. Todos os direitos reservados.</span>
          <span>Feito com {PLATFORM_NAME}</span>
        </div>
      </div>
    </footer>
  );
}
