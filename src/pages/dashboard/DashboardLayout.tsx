import { useState } from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image,
  MessageSquareQuote,
  Palette,
  Store,
  Settings,
  LogOut,
  Loader2,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../hooks/useBusiness';
import { PLATFORM_NAME } from '../../config/platform';

const NAV_ITEMS = [
  { to: '/painel', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/painel/produtos', label: 'Produtos', icon: Package },
  { to: '/painel/categorias', label: 'Categorias', icon: FolderTree },
  { to: '/painel/banners', label: 'Banners', icon: Image },
  { to: '/painel/depoimentos', label: 'Depoimentos', icon: MessageSquareQuote },
  { to: '/painel/personalizacao', label: 'Personalização', icon: Palette },
  { to: '/painel/minha-loja', label: 'Minha Loja', icon: Store },
  { to: '/painel/configuracoes', label: 'Configurações', icon: Settings },
];

export default function DashboardLayout() {
  const { logOut } = useAuth();
  const { business, loading } = useBusiness();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </div>
    );
  }

  // Business hasn't finished the quick-setup step yet.
  if (business && business.status === 'onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 lg:flex">
      {/* Barra superior — só em ecrãs pequenos */}
      <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-white/10 sticky top-0 z-30 bg-[#0F172A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white">{PLATFORM_NAME}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Fundo escuro por trás do menu, só em mobile, quando aberto */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-white/10 flex flex-col bg-[#0F172A] transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:z-auto`}
      >
        <div className="h-16 flex items-center justify-between gap-2 px-6 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <Store size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-white truncate">{PLATFORM_NAME}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-white truncate">{business?.name}</p>
            <p className="text-xs text-slate-500">Plano {business?.plan === 'pro' ? 'Pro' : 'Grátis'}</p>
          </div>
          <button
            onClick={() => logOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
