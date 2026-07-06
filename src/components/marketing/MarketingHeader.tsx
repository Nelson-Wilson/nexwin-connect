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

export default function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
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
        isScrolled || isMobileOpen ? 'glass-header py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-display font-bold text-white text-sm shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            NX
          </span>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            NexWin <span className="text-blue-500">Connect</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to={dashboardHref}
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            {!loading && user ? 'Ir para o Painel' : 'Entrar'}
          </Link>
          <Link
            to="/registar"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
          >
            Criar Loja Grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((v) => !v)}
          className="lg:hidden text-white p-2 -mr-2"
          aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden glass-header border-t border-white/5 mt-3">
          <div className="px-4 sm:px-6 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-white py-3 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to={dashboardHref}
                onClick={() => setIsMobileOpen(false)}
                className="text-center text-sm font-semibold text-slate-200 border border-white/10 rounded-lg py-3"
              >
                {!loading && user ? 'Ir para o Painel' : 'Entrar'}
              </Link>
              <Link
                to="/registar"
                onClick={() => setIsMobileOpen(false)}
                className="text-center text-sm font-semibold text-white bg-blue-600 rounded-lg py-3"
              >
                Criar Loja Grátis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
