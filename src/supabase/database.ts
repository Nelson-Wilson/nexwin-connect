import { supabase, isSupabaseConfigured } from './client';
import { toRow, fromRows } from './caseMapping';
import { TABLES, LEGACY_BUSINESS_ID } from './tables';
import { Product, Testimonial, Promotion, Banner } from '../types';

const IS_PROD = import.meta.env.PROD;

// ─── Dev-only in-memory store ──────────────────────────────────────────────
const memStore: Record<string, Map<string, any>> = {
  products: new Map(),
  promotions: new Map(),
  testimonials: new Map(),
  banners: new Map(),
};

function memGet<T>(col: string): T[] {
  return Array.from(memStore[col]?.values() ?? []) as T[];
}
function memSet(col: string, id: string, data: any) {
  if (!memStore[col]) memStore[col] = new Map();
  memStore[col].set(id, { ...data, id });
}
function memDel(col: string, id: string) {
  memStore[col]?.delete(id);
}

// ─── Default seed data (dev mode) ─────────────────────────────────────────
function seedDefaultData() {
  if (memStore.products.size > 0) return;

  const defaultProducts: Product[] = [
    {
      id: 'prod_1',
      name: 'Conjunto Alfaiataria Premium',
      category: 'vestuario',
      subcategory: 'Conjuntos',
      price: 2500,
      originalPrice: 2900,
      description: 'Conjunto de alfaiataria premium em tecido estruturado de alta qualidade. Ideal para eventos sofisticados ou look profissional elegante.',
      status: 'disponivel',
      images: ['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80'],
      featured: true,
      bestseller: true,
      news: false,
      createdAt: new Date('2026-06-01').toISOString(),
    },
    {
      id: 'prod_2',
      name: 'Vestido de Linho Elegance',
      category: 'vestuario',
      subcategory: 'Vestidos',
      price: 1800,
      description: 'Vestido longo de linho puro com modelagem fluida e decote sutil.',
      status: 'disponivel',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'],
      featured: true,
      news: true,
      createdAt: new Date('2026-06-15').toISOString(),
    },
    {
      id: 'prod_3',
      name: 'Moletom Oversized Carbono',
      category: 'vestuario',
      subcategory: 'Moletons',
      price: 2200,
      originalPrice: 2400,
      description: 'Moletom oversized com interior flanelado. Bolso canguru e acabamento premium.',
      status: 'disponivel',
      images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'],
      bestseller: true,
      createdAt: new Date('2026-06-10').toISOString(),
    },
    {
      id: 'prod_7',
      name: 'Tênis Air Runner Sport',
      category: 'calcados',
      subcategory: 'Tênis',
      price: 4500,
      originalPrice: 5200,
      description: 'Tênis de alta performance com amortecimento responsivo.',
      status: 'disponivel',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'],
      featured: true,
      createdAt: new Date('2026-06-18').toISOString(),
    },
    {
      id: 'sorvete_250',
      name: 'Sorvete de Malambe 250ml',
      category: 'sorvete',
      subcategory: 'Sorvete 250ml',
      price: 150,
      description: 'Sorvete artesanal cremoso com o autêntico sabor do fruto de embondeiro (malambe). 250ml.',
      status: 'disponivel',
      images: ['https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop&q=80'],
      featured: true,
      bestseller: true,
      nutritionalInfo: { calories: '180kcal', vitaminC: '28mg', calcium: '120mg', fiber: '2g' },
      createdAt: new Date('2026-06-01').toISOString(),
    },
    {
      id: 'sorvete_500',
      name: 'Sorvete de Malambe 500ml',
      category: 'sorvete',
      subcategory: 'Sorvete 500ml',
      price: 280,
      description: 'Sorvete artesanal cremoso com o autêntico sabor tropical do malambe. 500ml para partilhar.',
      status: 'disponivel',
      images: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80'],
      featured: true,
      nutritionalInfo: { calories: '360kcal', vitaminC: '56mg', calcium: '240mg', fiber: '4g' },
      createdAt: new Date('2026-06-01').toISOString(),
    },
    {
      id: 'sorvete_700',
      name: 'Sorvete de Malambe 700ml',
      category: 'sorvete',
      subcategory: 'Sorvete 700ml',
      price: 380,
      description: 'Sorvete artesanal premium de malambe em embalagem familiar 700ml. Sabor exótico do embondeiro.',
      status: 'disponivel',
      images: ['https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80'],
      featured: true,
      nutritionalInfo: { calories: '504kcal', vitaminC: '78mg', calcium: '336mg', fiber: '5.6g' },
      createdAt: new Date('2026-06-01').toISOString(),
    },
  ];

  defaultProducts.forEach(p => memSet('products', p.id, p));

  const defaultTestimonials: Testimonial[] = [
    { id: 'test_1', name: 'Ana Machava', role: 'Cliente Fiel', comment: 'O sorvete de malambe é incrível! Nunca tinha provado algo tão original e delicioso.', rating: 5 },
    { id: 'test_2', name: 'Carlos Sitoe', role: 'Empresário', comment: 'As roupas têm uma qualidade excelente. Atendimento via WhatsApp muito rápido!', rating: 5 },
  ];
  defaultTestimonials.forEach(t => memSet('testimonials', t.id, t));
}

if (!IS_PROD && !isSupabaseConfigured) {
  seedDefaultData();
}

// ─── Supabase (Postgres) service ───────────────────────────────────────────
// Todas as leituras/escritas filtram/marcam com LEGACY_BUSINESS_ID, já que
// (desde a unificação do schema) `products`/`categories`/`banners`/
// `testimonials`/`promotions`/`settings` são tabelas partilhadas com a
// plataforma SaaS, isoladas apenas por `business_id`.
export const firestoreService = {
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLES.PRODUCTS)
          .select('*')
          .eq('business_id', LEGACY_BUSINESS_ID);
        if (error) throw error;
        const items = fromRows<Product>(data);
        return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (err) {
        console.error('Supabase getProducts failed:', err);
        if (IS_PROD) throw err;
      }
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    return memGet<Product>('products').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async saveProduct(product: Product): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const row = { ...toRow(product), business_id: LEGACY_BUSINESS_ID };
      const { error } = await supabase.from(TABLES.PRODUCTS).upsert(row);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memSet('products', product.id, product);
  },

  async deleteProduct(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      // Soft delete — mantém o histórico, consistente com o resto do schema.
      const { error } = await supabase
        .from(TABLES.PRODUCTS)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('business_id', LEGACY_BUSINESS_ID);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memDel('products', id);
  },

  async getPromotions(): Promise<Promotion[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLES.PROMOTIONS)
          .select('*')
          .eq('business_id', LEGACY_BUSINESS_ID);
        if (error) throw error;
        return fromRows<Promotion>(data);
      } catch (err) {
        console.error('Supabase getPromotions failed:', err);
        if (IS_PROD) throw err;
      }
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    return memGet<Promotion>('promotions');
  },

  async savePromotion(promo: Promotion): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const row = { ...toRow(promo), business_id: LEGACY_BUSINESS_ID };
      const { error } = await supabase.from(TABLES.PROMOTIONS).upsert(row);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memSet('promotions', promo.id, promo);
  },

  async deletePromotion(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(TABLES.PROMOTIONS)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('business_id', LEGACY_BUSINESS_ID);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memDel('promotions', id);
  },

  async getBanners(): Promise<Banner[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLES.BANNERS)
          .select('*')
          .eq('business_id', LEGACY_BUSINESS_ID);
        if (error) throw error;
        return fromRows<Banner>(data);
      } catch (err) {
        console.error('Supabase getBanners failed:', err);
        if (IS_PROD) throw err;
      }
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    return memGet<Banner>('banners');
  },

  async saveBanner(banner: Banner): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const row = { ...toRow(banner), business_id: LEGACY_BUSINESS_ID };
      const { error } = await supabase.from(TABLES.BANNERS).upsert(row);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memSet('banners', banner.id, banner);
  },

  async deleteBanner(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(TABLES.BANNERS)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('business_id', LEGACY_BUSINESS_ID);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memDel('banners', id);
  },

  async getTestimonials(): Promise<Testimonial[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLES.TESTIMONIALS)
          .select('*')
          .eq('business_id', LEGACY_BUSINESS_ID);
        if (error) throw error;
        return fromRows<Testimonial>(data);
      } catch (err) {
        console.error('Supabase getTestimonials failed:', err);
        if (IS_PROD) throw err;
      }
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    return memGet<Testimonial>('testimonials');
  },

  async saveTestimonial(test: Testimonial): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const row = { ...toRow(test), business_id: LEGACY_BUSINESS_ID };
      const { error } = await supabase.from(TABLES.TESTIMONIALS).upsert(row);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memSet('testimonials', test.id, test);
  },

  async deleteTestimonial(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(TABLES.TESTIMONIALS)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('business_id', LEGACY_BUSINESS_ID);
      if (error) throw error;
      return;
    }
    if (IS_PROD) throw new Error('Supabase não configurado.');
    memDel('testimonials', id);
  },

  async getCategories(): Promise<string[]> {
    const fallback = ['vestuario', 'calcados', 'sorvete'];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLES.CATEGORIES)
          .select('name')
          .eq('business_id', LEGACY_BUSINESS_ID)
          .order('order', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) return data.map((row) => row.name as string);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    return fallback;
  },

  /**
   * Substitui a lista completa de categorias do catálogo legado.
   * Como a tabela `categories` guarda uma linha por categoria (não uma
   * lista única, como no antigo doc "categories/main"), a forma mais
   * simples e segura de "substituir a lista toda" é: soft-delete das
   * categorias atuais + inserir as novas, na ordem dada.
   */
  async saveCategories(list: string[]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error: delError } = await supabase
        .from(TABLES.CATEGORIES)
        .update({ deleted_at: new Date().toISOString() })
        .eq('business_id', LEGACY_BUSINESS_ID)
        .is('deleted_at', null);
      if (delError) throw delError;

      if (list.length > 0) {
        const rows = list.map((name, index) => ({
          business_id: LEGACY_BUSINESS_ID,
          name,
          order: index,
        }));
        const { error: insError } = await supabase.from(TABLES.CATEGORIES).insert(rows);
        if (insError) throw insError;
      }
    }
  },

  async getSettings(): Promise<any> {
    const defaults = {
      whatsappNumber: '+258866473065',
      catalogTitle: 'Malambe & Moda',
      maintenanceMode: false,
    };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLES.SETTINGS)
          .select('*')
          .eq('business_id', LEGACY_BUSINESS_ID)
          .is('deleted_at', null)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          return {
            whatsappNumber: data.whatsapp_number ?? defaults.whatsappNumber,
            catalogTitle: data.catalog_title ?? defaults.catalogTitle,
            maintenanceMode: data.maintenance_mode ?? defaults.maintenanceMode,
          };
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    }
    return defaults;
  },

  async saveSettings(settings: any): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: existing, error: selError } = await supabase
        .from(TABLES.SETTINGS)
        .select('id')
        .eq('business_id', LEGACY_BUSINESS_ID)
        .is('deleted_at', null)
        .maybeSingle();
      if (selError) throw selError;

      const row = {
        whatsapp_number: settings.whatsappNumber,
        catalog_title: settings.catalogTitle,
        maintenance_mode: settings.maintenanceMode,
      };

      if (existing) {
        const { error } = await supabase.from(TABLES.SETTINGS).update(row).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(TABLES.SETTINGS)
          .insert({ ...row, business_id: LEGACY_BUSINESS_ID });
        if (error) throw error;
      }
    }
  },
};
