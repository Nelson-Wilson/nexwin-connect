import { useEffect, useState } from 'react';
import { businessService } from '../services/businessService';
import type { Business } from '../models/business.model';

/**
 * Loads a business by its public slug — no authentication required.
 * This is what the public storefront (`/loja/:slug`) will use once the
 * catalogue components are migrated to be tenant-driven (Sprint 4).
 */
export function usePublicBusiness(slug: string | undefined) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    businessService
      .getBySlug(slug)
      .then((biz) => {
        if (cancelled) return;
        if (!biz || biz.status !== 'active') {
          setNotFound(true);
          setBusiness(null);
        } else {
          setBusiness(biz);
        }
      })
      .catch((err) => {
        console.error('Falha ao carregar loja pública:', err);
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { business, loading, notFound };
}
