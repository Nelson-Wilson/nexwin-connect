/**
 * Generic CRUD factory for the businessId-scoped tables
 * (store_products, store_categories, store_banners, store_testimonials,
 * store_promotions). Keeps the 5 entity services thin and consistent.
 */
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { toRow, fromRows, camelToSnake } from '../supabase/caseMapping';

interface WithId {
  id: string;
  businessId: string;
}

export function createStoreCollectionService<T extends WithId>(tableName: string) {
  function assertConfigured() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase não está configurado.');
    }
  }

  return {
    async listByBusiness(businessId: string, orderByField?: keyof T & string): Promise<T[]> {
      assertConfigured();
      let query = supabase!.from(tableName).select('*').eq('business_id', businessId);
      if (orderByField) {
        query = query.order(camelToSnake(orderByField));
      }
      const { data, error } = await query;
      if (error) throw error;
      return fromRows<T>(data);
    },

    async create(item: T): Promise<void> {
      assertConfigured();
      const { error } = await supabase!.from(tableName).insert(toRow(item));
      if (error) throw error;
    },

    async update(id: string, patch: Partial<T>): Promise<void> {
      assertConfigured();
      const { error } = await supabase!.from(tableName).update(toRow(patch)).eq('id', id);
      if (error) throw error;
    },

    async remove(id: string): Promise<void> {
      assertConfigured();
      const { error } = await supabase!.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },

    newId(): string {
      // Gerado no cliente (tal como o doc(collection(...)).id do Firestore),
      // para poder ser usado antes do registo ser criado (ex.: pastas de
      // upload de imagem que incluem o id do item).
      return crypto.randomUUID();
    },
  };
}
