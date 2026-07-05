/**
 * Marketing-related entities belonging to a business (tenant): banners,
 * testimonials and promotions. Each collection is scoped by `businessId`.
 *
 * Supabase tables: `store_banners`, `store_testimonials`, `store_promotions`.
 */

export interface StoreBanner {
  id: string;
  businessId: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export interface StoreTestimonial {
  id: string;
  businessId: string;
  name: string;
  role?: string;
  comment: string;
  rating: number;
  photo?: string;
  createdAt: string;
}

export interface StorePromotion {
  id: string;
  businessId: string;
  title: string;
  discount: string;
  description: string;
  bannerImage: string;
  code?: string;
  active: boolean;
  createdAt: string;
}

export type NewStoreBanner = Omit<StoreBanner, 'id' | 'createdAt'>;
export type NewStoreTestimonial = Omit<StoreTestimonial, 'id' | 'createdAt'>;
export type NewStorePromotion = Omit<StorePromotion, 'id' | 'createdAt'>;
