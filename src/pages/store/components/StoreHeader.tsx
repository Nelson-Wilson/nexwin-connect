import { useEffect, useState } from 'react';
import { Menu, X, Search, MessageCircle, Store as StoreIcon, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCategoryIcon } from '../../dashboard/components/iconRegistry';
import { useInstallPrompt } from '../../../hooks/useInstallPrompt';

export default function StoreHeader({
  searchValue,
  onSearchChange,
  activeCategory,
  onCategorySelect,
}: {
  searchValue: string;
  onSearchChange: (v: string) => void;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}) {
  const { business, accent, categories, whatsappLink } = useStore();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id: string, category?: string) => {
    setIsMobileMenuOpen(false);
    if (category !== undefined) onCategorySelect(category);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const wa = whatsappLink('Olá! Estou a ver o catálogo e gostaria de fazer uma pergunta.');

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0F172A]/90 border-b border-white/10 backdrop-blur-md py-3 shadow-lg' : 'bg-[#0F172A]/40 border-b border-white/5 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => goTo('inicio')} className="flex items-center gap-3 group text-left cursor-pointer min-w-0">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: accent }}
              >
                <StoreIcon size={15} />
              </div>
            )}
            <span className="font-display font-black text-lg tracking-tighter text-white truncate">{business.name}</span>
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-bold uppercase tracking-widest">
            <button
              onClick={() => goTo('inicio', 'todos')}
              className="pb-1 border-b transition-colors"
              style={activeCategory === 'todos' ? { color: 'white', borderColor: accent } : { color: '#94a3b8', borderColor: 'transparent' }}
            >
              Início
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => goTo('catalogo', cat.name)}
                className="pb-1 border-b transition-colors"
                style={activeCategory === cat.name ? { color: 'white', borderColor: accent } : { color: '#94a3b8', borderColor: 'transparent' }}
              >
                {cat.name}
              </button>
            ))}
            <button onClick={() => goTo('contactos')} className="pb-1 text-slate-400 hover:text-white transition-colors">
              Contactos
            </button>
          </nav>

          <form onSubmit={submitSearch} className="hidden md:flex items-center relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Pesquisar catálogo..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:border-transparent transition-all"
              style={{ boxShadow: 'none' }}
            />
            <button type="submit" className="absolute right-3 text-slate-400 hover:text-white">
              <Search size={15} />
            </button>
          </form>

          <div className="flex items-center gap-3 shrink-0">
            {canInstall && (
              <button
                onClick={promptInstall}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-xs font-semibold transition-colors"
                title="Instalar aplicativo"
              >
                <Download size={14} />
                Instalar
              </button>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
                title="Falar no WhatsApp"
              >
                <MessageCircle size={17} />
              </a>
            )}
            <button onClick={() => setIsMobileMenuOpen((v) => !v)} className="lg:hidden p-1.5 text-slate-300 hover:text-white transition-colors">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0F172A] border-t border-white/10 py-6 px-4 shadow-xl flex flex-col gap-1">
          <form onSubmit={submitSearch} className="flex items-center relative w-full mb-3">
            <input
              type="text"
              placeholder="Pesquisar no catálogo..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 text-slate-400 hover:text-white">
              <Search size={16} />
            </button>
          </form>
          <button onClick={() => goTo('inicio', 'todos')} className="text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-white/5">
            Início
          </button>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <button key={cat.id} onClick={() => goTo('catalogo', cat.name)} className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-white/5">
                <Icon size={14} /> {cat.name}
              </button>
            );
          })}
          <button onClick={() => goTo('contactos')} className="text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-white/5">
            Contactos
          </button>
        </div>
      )}
    </header>
  );
}
