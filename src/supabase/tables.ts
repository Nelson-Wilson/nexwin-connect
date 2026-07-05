/**
 * Table names — schema unificado (ver supabase/migrations/0001_schema.sql).
 *
 * Desde a unificação, NÃO existem mais tabelas separadas para o catálogo
 * legado (antes: products/categories/banners/testimonials/promotions) e
 * para a plataforma SaaS (antes: store_products/store_categories/...).
 * Existe uma única tabela de cada, sempre filtrada por `business_id`.
 */
export const TABLES = {
  BUSINESSES: 'businesses',
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BANNERS: 'banners',
  TESTIMONIALS: 'testimonials',
  PROMOTIONS: 'promotions',
  SETTINGS: 'settings',
} as const;

/**
 * business_id fixo do catálogo legado single-tenant ("Malambe & Moda"),
 * criado pelo seed em supabase/migrations/0001_schema.sql. Todo o código
 * em src/supabase/database.ts e src/supabase/storage.ts usa esta constante
 * para filtrar/marcar as suas leituras e escritas.
 */
export const LEGACY_BUSINESS_ID = '11111111-1111-1111-1111-111111111111';
