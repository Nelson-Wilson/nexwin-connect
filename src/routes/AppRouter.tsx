import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { BusinessProvider } from '../contexts/BusinessContext';
import ProtectedRoute from './ProtectedRoute';

// Legacy single-tenant catalogue — component untouched, only its route moved
// (see note below). Kept reachable at "/catalogo" so it keeps working exactly
// as before, it's just no longer what greets first-time visitors at "/".
import LegacyApp from '../App';

// Institutional homepage for the NexWin Connect platform
import LandingPage from '../pages/marketing/LandingPage';

// New SaaS pages
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import OnboardingWizard from '../pages/onboarding/OnboardingWizard';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import ProductsPage from '../pages/dashboard/produtos/ProductsPage';
import CategoriesPage from '../pages/dashboard/categorias/CategoriesPage';
import BannersPage from '../pages/dashboard/banners/BannersPage';
import TestimonialsPage from '../pages/dashboard/depoimentos/TestimonialsPage';
import PersonalizacaoPage from '../pages/dashboard/personalizacao/PersonalizacaoPage';
import MinhaLojaPage from '../pages/dashboard/minha-loja/MinhaLojaPage';
import SettingsPage from '../pages/dashboard/configuracoes/SettingsPage';
import PublicStorePage from '../pages/store/PublicStorePage';
import NotFoundPage from '../pages/shared/NotFoundPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Institutional homepage — the platform, not a single catalogue */}
          <Route path="/" element={<LandingPage />} />

          {/* Legacy single-tenant catalogue — component preserved exactly as
              before, moved here from "/" so it keeps working for anyone with
              the old link/bookmarks. */}
          <Route path="/catalogo" element={<LegacyApp />} />

          {/* Public multi-tenant storefront */}
          <Route path="/loja/:slug" element={<PublicStorePage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registar" element={<SignupPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

          {/* Onboarding wizard (business.status === 'onboarding') */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <BusinessProvider>
                  <OnboardingWizard />
                </BusinessProvider>
              </ProtectedRoute>
            }
          />

          {/* Dashboard (protected) */}
          <Route
            path="/painel"
            element={
              <ProtectedRoute>
                <BusinessProvider>
                  <DashboardLayout />
                </BusinessProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="produtos" element={<ProductsPage />} />
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="banners" element={<BannersPage />} />
            <Route path="depoimentos" element={<TestimonialsPage />} />
            <Route path="personalizacao" element={<PersonalizacaoPage />} />
            <Route path="minha-loja" element={<MinhaLojaPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
