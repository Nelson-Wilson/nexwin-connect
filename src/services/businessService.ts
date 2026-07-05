import { supabase, isSupabaseConfigured } from '../supabase/client';
import { toRow, fromRow } from '../supabase/caseMapping';
import { TABLES } from '../supabase/tables';
import { generateUUID } from '../utils/uuid';
import type { Business, BusinessStatus } from '../models/business.model';
import { slugify } from '../utils/slugify';

export { slugify };

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase não está configurado.');
  }
}

export const businessService = {
  async isSlugAvailable(slug: string, ignoreBusinessId?: string): Promise<boolean> {
    assertConfigured();
    const { data, error } = await supabase!
      .from(TABLES.BUSINESSES)
      .select('id')
      .eq('slug', slug)
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return true;
    return data[0].id === ignoreBusinessId;
  },

  /** Generates a unique slug from a base name, appending -2, -3... if taken. */
  async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name) || 'loja';
    let candidate = base;
    let attempt = 1;
    while (!(await this.isSlugAvailable(candidate))) {
      attempt += 1;
      candidate = `${base}-${attempt}`;
    }
    return candidate;
  },

  /** Auto-creates a draft business right after sign-up (called from AuthContext). */
  async createDraftForOwner(ownerId: string, ownerName: string): Promise<Business> {
    assertConfigured();
    const id = generateUUID();
    const slug = await this.generateUniqueSlug(ownerName || 'minha-loja');
    const now = new Date().toISOString();
    const business: Business = {
      id,
      ownerId,
      name: `Loja de ${ownerName}`.trim(),
      slug,
      businessType: 'outros',
      theme: 'azul',
      status: 'onboarding',
      plan: 'free',
      createdAt: now,
      updatedAt: now,
    };
    const { error } = await supabase!.from(TABLES.BUSINESSES).insert(toRow(business));
    if (error) throw error;
    return business;
  },

  async getById(businessId: string): Promise<Business | null> {
    assertConfigured();
    const { data, error } = await supabase!
      .from(TABLES.BUSINESSES)
      .select('*')
      .eq('id', businessId)
      .maybeSingle();
    if (error) throw error;
    return fromRow<Business>(data);
  },

  async getBySlug(slug: string): Promise<Business | null> {
    assertConfigured();
    const { data, error } = await supabase!
      .from(TABLES.BUSINESSES)
      .select('*')
      .eq('slug', slug)
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return fromRow<Business>(data[0]);
  },

  async getByOwnerId(ownerId: string): Promise<Business | null> {
    assertConfigured();
    const { data, error } = await supabase!
      .from(TABLES.BUSINESSES)
      .select('*')
      .eq('owner_id', ownerId)
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return fromRow<Business>(data[0]);
  },

  async update(businessId: string, patch: Partial<Business>): Promise<void> {
    assertConfigured();
    const { error } = await supabase!
      .from(TABLES.BUSINESSES)
      .update(toRow({ ...patch, updatedAt: new Date().toISOString() }))
      .eq('id', businessId);
    if (error) throw error;
  },

  async setStatus(businessId: string, status: BusinessStatus): Promise<void> {
    await this.update(businessId, { status });
  },
};
