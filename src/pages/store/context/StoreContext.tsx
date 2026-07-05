import { createContext, useContext } from 'react';
import type { Business } from '../../../models/business.model';
import type { StoreProduct } from '../../../models/product.model';
import type { StoreCategory } from '../../../models/category.model';
import type { StoreBanner, StoreTestimonial, StorePromotion } from '../../../models/marketing.model';

export interface StoreContextValue {
  business: Business;
  accent: string;
  accentSoft: string;
  products: StoreProduct[];
  categories: StoreCategory[];
  banners: StoreBanner[];
  testimonials: StoreTestimonial[];
  promotions: StorePromotion[];
  /** Builds a wa.me link with a pre-filled message, using the business's WhatsApp number. */
  whatsappLink: (message: string) => string | null;
  /** Opens the product modal and syncs the ?prod= query param for sharing. */
  openProduct: (product: StoreProduct) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore deve ser usado dentro de <StoreContext.Provider>.');
  return ctx;
}
