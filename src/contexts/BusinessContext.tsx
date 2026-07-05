import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { businessService } from '../services/businessService';
import type { Business } from '../models/business.model';

export interface BusinessContextValue {
  business: Business | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateBusiness: (patch: Partial<Business>) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

/**
 * Provides the business owned by the currently authenticated user.
 * Must be mounted below <AuthProvider> and only where a business is
 * expected (dashboard / onboarding routes) — not on the public storefront,
 * which uses `usePublicBusiness(slug)` instead since it has no logged-in owner.
 */
export function BusinessProvider({ children }: { children: ReactNode }) {
  const { platformUser } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!platformUser) {
      setBusiness(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const biz = await businessService.getById(platformUser.businessId);
      setBusiness(biz);
    } catch (err) {
      console.error('Falha ao carregar a loja:', err);
      setError('Não foi possível carregar os dados da sua loja.');
    } finally {
      setLoading(false);
    }
  }, [platformUser]);

  useEffect(() => {
    load();
  }, [load]);

  const updateBusiness = useCallback(
    async (patch: Partial<Business>) => {
      if (!business) return;
      await businessService.update(business.id, patch);
      setBusiness({ ...business, ...patch, updatedAt: new Date().toISOString() });
    },
    [business]
  );

  const value: BusinessContextValue = {
    business,
    loading,
    error,
    refresh: load,
    updateBusiness,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}
