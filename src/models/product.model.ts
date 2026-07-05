/**
 * Product belonging to a business (tenant).
 * Supabase table: `store_products`, scoped by the `businessId` field.
 *
 * NOTE: this is the multi-tenant sibling of the legacy `Product` type in
 * `src/types.ts` used by the original single-tenant catalogue. The legacy
 * type stays untouched so the existing catalogue keeps working with zero
 * regressions; new SaaS code should import `StoreProduct` from here instead.
 */

export type ProductStatus = 'disponivel' | 'esgotado';

export interface StoreProduct {
  id: string;
  businessId: string;
  name: string;
  category: string; // free-form: references StoreCategory.name for this business
  subcategory?: string;
  price: number;
  originalPrice?: number;
  description: string;
  status: ProductStatus;
  images: string[];
  featured?: boolean;
  bestseller?: boolean;
  news?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewStoreProduct = Omit<StoreProduct, 'id' | 'createdAt' | 'updatedAt'>;
