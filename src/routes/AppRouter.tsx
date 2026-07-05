import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { BusinessProvider } from '../contexts/BusinessContext';
import ProtectedRoute from './ProtectedRoute';

// Legacy single-tenant catalogue — untouched, mounted as-is at "/" so nothing
// regresses while the SaaS layer is built alongside it.
import LegacyApp from '../App';

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
          {/* Legacy catalogue — preserved exactly as before */}
          <Route path="/" element={<LegacyApp />} />

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
