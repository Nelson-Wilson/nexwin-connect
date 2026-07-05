import { supabase, isSupabaseConfigured } from '../supabase/client';
import { TABLES } from '../supabase/tables';
import type { PlatformUser } from '../models/user.model';

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase não está configurado.');
  }
}

// Mapeamento manual (não via caseMapping genérico): a coluna Postgres
// chama-se `id` (é a PK, igual ao Supabase Auth user id), mas o modelo
// TypeScript usa `uid` para deixar claro que é sempre um Auth user id.
function toRow(profile: PlatformUser) {
  return {
    id: profile.uid,
    business_id: profile.businessId,
    name: profile.name,
    email: profile.email,
    role: profile.role,
  };
}

function fromRow(row: Record<string, any> | null): PlatformUser | null {
  if (!row) return null;
  return {
    uid: row.id,
    name: row.name,
    email: row.email,
    businessId: row.business_id,
    role: row.role,
    createdAt: row.created_at,
  };
}

export const userService = {
  async create(profile: PlatformUser): Promise<void> {
    assertConfigured();
    const { error } = await supabase!.from(TABLES.USERS).insert(toRow(profile));
    if (error) throw error;
  },

  async getByUid(uid: string): Promise<PlatformUser | null> {
    assertConfigured();
    const { data, error } = await supabase!
      .from(TABLES.USERS)
      .select('*')
      .eq('id', uid)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw error;
    return fromRow(data);
  },
};
