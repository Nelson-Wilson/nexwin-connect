/**
 * Product category belonging to a business (tenant).
 * Supabase table: `store_categories`, scoped by the `businessId` field.
 */

export interface StoreCategory {
  id: string;
  businessId: string;
  name: string;
  icon?: string; // lucide-react icon name
  color?: string; // hex
  order: number;
  createdAt: string;
}

export type NewStoreCategory = Omit<StoreCategory, 'id' | 'createdAt'>;
