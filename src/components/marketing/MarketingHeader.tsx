import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_LINKS = [
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#exemplos', label: 'Exemplos' },
  { href: '#precos', label: 'Preços' },
  { href: '#faq', label: 'FAQ' },
];

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-display font-extrabold text-white text-sm shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
        NX
      </span>
      <span className={`font-display font-extrabold text-lg tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        NexWin <span className={light ? 'text-blue-300' : 'text-blue-600'}>Connect</span>
      </span>
    </Link>
  );
}

export default function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const dashboardHref = !loading && user ? '/painel' : '/login';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileOpen ? 'ui-header py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <BrandMark />

        <nav className="hidden lg:flex items-center gap-8" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to={dashboardHref} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2">
            {!loading && user ? 'Ir para o Painel' : 'Entrar'}
          </Link>
          <Link
            to="/registar"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all active:scale-[0.98]"
          >
            Criar minha loja
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((v) => !v)}
          className="lg:hidden text-slate-800 p-2 -mr-2"
          aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 mt-3">
          <div className="px-4 sm:px-6 py-5 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-blue-600 py-3 border-b border-slate-100"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to={dashboardHref}
                onClick={() => setIsMobileOpen(false)}
                className="text-center text-sm font-semibold text-slate-800 border border-slate-200 rounded-xl py-3"
              >
                {!loading && user ? 'Ir para o Painel' : 'Entrar'}
              </Link>
              <Link
                to="/registar"
                onClick={() => setIsMobileOpen(false)}
                className="text-center text-sm font-semibold text-white bg-blue-600 rounded-xl py-3"
              >
                Criar minha loja
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
