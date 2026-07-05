import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, Phone, LogOut, ShieldCheck, Search } from 'lucide-react';
import { loginUser, logoutUser } from '../supabase/auth';

interface HeaderProps {
  onSearchChange: (search: string) => void;
  searchValue: string;
  onCategorySelect: (category: 'todos' | 'vestuario' | 'calcados' | 'sorvete') => void;
  activeCategory: string;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
}

export default function Header({
  onSearchChange,
  searchValue,
  onCategorySelect,
  activeCategory,
  isAdmin,
  setIsAdmin,
  showAdminPanel,
  setShowAdminPanel
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('admin@malambe.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const success = await loginUser(email, password);
      if (success) {
        setIsAdmin(true);
        setShowAdminPanel(true);
        setIsLoginModalOpen(false);
        setPassword('');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Credenciais inválidas! Tente novamente.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAdmin(false);
      setShowAdminPanel(false);
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToSection = (id: string, categoryFilter?: 'todos' | 'vestuario' | 'calcados' | 'sorvete') => {
    setIsMobileMenuOpen(false);
    setShowAdminPanel(false);
    
    if (categoryFilter) {
      onCategorySelect(categoryFilter);
    }
    
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0F172A]/90 border-b border-white/10 backdrop-blur-md py-3 shadow-lg' : 'bg-[#0F172A]/40 border-b border-white/5 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => navigateToSection('inicio')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md group-hover:scale-105 transition-all">
                B
              </div>
              <div>
                <span className="font-display font-black text-lg sm:text-xl tracking-tighter block text-white">
                  CANTINHO DA <span className="text-blue-500">BIANCA</span>
                </span>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
              <button
                onClick={() => navigateToSection('inicio')}
                className={`transition-colors cursor-pointer pb-1 border-b ${
                  activeCategory === 'todos' && !showAdminPanel ? 'text-white border-blue-500' : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => navigateToSection('catalogo', 'vestuario')}
                className={`transition-colors cursor-pointer pb-1 border-b ${
                  activeCategory === 'vestuario' && !showAdminPanel ? 'text-white border-blue-500' : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                Vestuário
              </button>
              <button
                onClick={() => navigateToSection('catalogo', 'calcados')}
                className={`transition-colors cursor-pointer pb-1 border-b ${
                  activeCategory === 'calcados' && !showAdminPanel ? 'text-white border-blue-500' : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                Calçados
              </button>
              <button
                onClick={() => navigateToSection('sorvete-malambe', 'sorvete')}
                className={`transition-colors cursor-pointer pb-1 border-b ${
                  activeCategory === 'sorvete' && !showAdminPanel ? 'text-white border-blue-500' : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                Yougurt de Malambe
              </button>
              <button
                onClick={() => navigateToSection('promocoes')}
                className="transition-colors cursor-pointer pb-1 text-slate-400 hover:text-white border-transparent"
              >
                Promoções 🔥
              </button>
              <button
                onClick={() => navigateToSection('contactos')}
                className="transition-colors cursor-pointer pb-1 text-slate-400 hover:text-white border-transparent"
              >
                Contactos
              </button>
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Pesquisar catálogo..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearchChange(e.target.value);
                }}
                className="w-full bg-[#0F172A]/80 border border-white/10 text-slate-100 placeholder-slate-500 text-xs rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <button type="submit" className="absolute right-3 text-slate-400 hover:text-white">
                <Search size={14} />
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Admin Button */}
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      showAdminPanel
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <ShieldCheck size={14} />
                    <span className="hidden sm:inline">Painel Admin</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    title="Terminar Sessão"
                    className="p-1.5 rounded-full bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/30 transition-all cursor-pointer"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white transition-all cursor-pointer"
                >
                  <User size={14} />
                  <span className="hidden sm:inline">Entrar (Admin)</span>
                </button>
              )}

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/258866473065?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20os%20produtos%20do%20seu%20cat%C3%A1logo."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group"
                title="Falar no WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {/* Visual indicator pulse */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-300 hover:text-white transition-colors"
                id="menu-toggle"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full glass-header py-6 px-4 shadow-xl flex flex-col gap-4 animate-fadeIn border-t border-slate-800">
            {/* Search form for Mobile */}
            <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full mb-2">
              <input
                type="text"
                placeholder="Pesquisar no catálogo..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearchChange(e.target.value);
                }}
                className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button type="submit" className="absolute right-3 text-slate-400 hover:text-white">
                <Search size={16} />
              </button>
            </form>

            <button
              onClick={() => navigateToSection('inicio')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-900/60"
            >
              Início
            </button>
            <button
              onClick={() => navigateToSection('catalogo', 'vestuario')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-900/60"
            >
              Vestuário
            </button>
            <button
              onClick={() => navigateToSection('catalogo', 'calcados')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-900/60"
            >
              Calçados
            </button>
            <button
              onClick={() => navigateToSection('sorvete-malambe', 'sorvete')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-900/60"
            >
              Yougurt de Malambe
            </button>
            <button
              onClick={() => navigateToSection('promocoes')}
              className="text-left py-2 px-3 text-sm font-semibold text-amber-400 hover:text-amber-300 rounded-lg hover:bg-slate-900/60"
            >
              Promoções 🔥
            </button>
            <button
              onClick={() => navigateToSection('contactos')}
              className="text-left py-2 px-3 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-900/60"
            >
              Contactos
            </button>
          </div>
        )}
      </header>

      {/* Login Admin Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl glass-modal p-6 sm:p-8 shadow-2xl border border-slate-800 bg-[#0F172A]">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setLoginError('');
                setPassword('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-900/40 text-blue-400 mb-3 border border-blue-800/40">
                <User size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Acesso Administrativo</h3>
              <p className="text-xs text-slate-400 mt-1">
                Autentique-se com as suas credenciais de administrador.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  E-mail do Administrador
                </label>
                <input
                  type="email"
                  placeholder="admin@malambe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg py-2 px-3">
                  ⚠️ {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3 text-sm shadow-lg shadow-blue-600/15 hover:shadow-blue-500/25 transition-all cursor-pointer"
              >
                Confirmar Login
              </button>

              <div className="text-center mt-3">
                <span className="text-[10px] text-slate-500">
                  Modo de simulação: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-blue-400">admin@malambe.com</code> + <code className="bg-slate-950 px-1.5 py-0.5 rounded text-blue-400">admin123</code>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
