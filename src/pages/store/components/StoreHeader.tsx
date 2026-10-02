import { useEffect, useState } from 'react';
import { Menu, X, Search, MessageCircle, Store as StoreIcon, Download, ShoppingBag } from 'lucide-react';
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
    `relative px-1 py-2 text-sm font-semibold transition-colors ${active ? 'text-white' : 'text-slate-200 hover:text-white'}`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#091d38] shadow-[0_10px_30px_rgba(11,26,47,0.18)] py-2.5' : 'bg-[#091d38] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => goTo('inicio')} className="flex items-center gap-3 group text-left cursor-pointer min-w-0">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-white/20 bg-white/10" />
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: accent }}
              >
                <StoreIcon size={16} />
              </div>
            )}
            <span className="font-display font-extrabold text-lg tracking-tight text-white truncate">{business.name}</span>
          </button>

          <form onSubmit={submitSearch} className="hidden xl:flex items-center relative max-w-md w-full">
            <input
              type="text"
              placeholder="Que produto procura?"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full bg-white text-slate-800 placeholder-slate-400 text-sm rounded-full pl-4 pr-11 py-2.5 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button type="submit" aria-label="Pesquisar" className="absolute right-3 text-slate-500 hover:text-slate-700">
              <Search size={15} />
            </button>
          </form>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Loja">
            <button onClick={() => goTo('inicio', 'todos')} className={navBtn(activeCategory === 'todos')}>
              Início
              {activeCategory === 'todos' && <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-white" />}
            </button>
            <button onClick={() => goTo('catalogo', 'todos')} className={navBtn(activeCategory === 'todos')}>
              Categorias
            </button>
            <button onClick={() => goTo('contactos')} className={navBtn(false)}>Contato</button>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Pesquisar no catálogo"
            >
              <Search size={16} />
            </button>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/25 transition-all"
                title="Falar no WhatsApp"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle size={17} />
              </a>
            )}
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white">
              <ShoppingBag size={16} />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden p-1.5 text-white transition-colors"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            {canInstall && (
              <button
                onClick={promptInstall}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/20 bg-white/5 text-white text-xs font-semibold transition-colors"
                title="Instalar aplicativo"
              >
                <Download size={14} />
                Instalar
              </button>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#091d38] border-t border-white/10 py-5 px-4 shadow-xl flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          <form onSubmit={submitSearch} className="flex items-center relative w-full mb-3">
            <input
              type="text"
              placeholder="Pesquisar no catálogo..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full bg-white text-slate-800 placeholder-slate-400 text-sm rounded-full pl-4 pr-10 py-3 focus:outline-none"
            />
            <button type="submit" aria-label="Pesquisar" className="absolute right-3 text-slate-400 hover:text-slate-700">
              <Search size={16} />
            </button>
          </form>
          <button onClick={() => goTo('inicio', 'todos')} className="text-left py-3 px-3 text-sm font-semibold text-white rounded-xl hover:bg-white/5">
            Início
          </button>
          <button onClick={() => goTo('catalogo', 'todos')} className="text-left py-3 px-3 text-sm font-semibold text-white rounded-xl hover:bg-white/5">
            Categorias
          </button>
          <button onClick={() => goTo('contactos')} className="text-left py-3 px-3 text-sm font-semibold text-white rounded-xl hover:bg-white/5">
            Contato
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
