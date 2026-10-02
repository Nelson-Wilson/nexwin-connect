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
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
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

  const navBtn = (active: boolean) =>
    `relative py-2 text-sm font-semibold transition-colors ${active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'ui-header py-2.5 shadow-sm' : 'bg-white/70 backdrop-blur-md border-b border-slate-200/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => goTo('inicio')} className="flex items-center gap-3 group text-left cursor-pointer min-w-0">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200" />
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: accent }}
              >
                <StoreIcon size={16} />
              </div>
            )}
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 truncate">{business.name}</span>
          </button>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Loja">
            <button onClick={() => goTo('inicio', 'todos')} className={navBtn(activeCategory === 'todos')}>
              Início
              {activeCategory === 'todos' && <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full" style={{ backgroundColor: accent }} />}
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button key={cat.id} onClick={() => goTo('catalogo', cat.name)} className={navBtn(activeCategory === cat.name)}>
                {cat.name}
                {activeCategory === cat.name && <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full" style={{ backgroundColor: accent }} />}
              </button>
            ))}
            <button onClick={() => goTo('contactos')} className={navBtn(false)}>
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
              className="w-full bg-slate-100 border border-transparent text-slate-800 placeholder-slate-400 text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:bg-white focus:border-slate-300 transition-colors"
            />
            <button type="submit" aria-label="Pesquisar" className="absolute right-3 text-slate-400 hover:text-slate-700">
              <Search size={15} />
            </button>
          </form>

          <div className="flex items-center gap-2.5 shrink-0">
            {canInstall && (
              <button
                onClick={promptInstall}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold transition-colors"
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
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
                title="Falar no WhatsApp"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle size={17} />
              </a>
            )}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-200 py-5 px-4 shadow-xl flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          <form onSubmit={submitSearch} className="flex items-center relative w-full mb-3">
            <input
              type="text"
              placeholder="Pesquisar no catálogo..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full bg-slate-100 border border-transparent text-slate-800 placeholder-slate-400 text-sm rounded-full pl-4 pr-10 py-3 focus:outline-none focus:bg-white focus:border-slate-300"
            />
            <button type="submit" aria-label="Pesquisar" className="absolute right-3 text-slate-400 hover:text-slate-700">
              <Search size={16} />
            </button>
          </form>
          <button onClick={() => goTo('inicio', 'todos')} className="text-left py-3 px-3 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50">
            Início
          </button>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <button key={cat.id} onClick={() => goTo('catalogo', cat.name)} className="flex items-center gap-2.5 text-left py-3 px-3 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50">
                <Icon size={15} style={{ color: accent }} /> {cat.name}
              </button>
            );
          })}
          <button onClick={() => goTo('contactos')} className="text-left py-3 px-3 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50">
            Contactos
          </button>
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold">
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          )}
        </div>
      )}
    </header>
  );
}
