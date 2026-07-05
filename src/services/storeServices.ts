import { TABLES } from '../supabase/tables';
import { createStoreCollectionService } from './storeCollectionFactory';
import type { StoreProduct } from '../models/product.model';
import type { StoreCategory } from '../models/category.model';
import type { StoreBanner, StoreTestimonial, StorePromotion } from '../models/marketing.model';

export const productService = createStoreCollectionService<StoreProduct>(TABLES.PRODUCTS);
export const categoryService = createStoreCollectionService<StoreCategory>(TABLES.CATEGORIES);
export const bannerService = createStoreCollectionService<StoreBanner>(TABLES.BANNERS);
export const testimonialService = createStoreCollectionService<StoreTestimonial>(TABLES.TESTIMONIALS);
export const promotionService = createStoreCollectionService<StorePromotion>(TABLES.PROMOTIONS);
