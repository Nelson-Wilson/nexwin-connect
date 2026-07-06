/**
 * Estatísticas reais e globais da plataforma, usadas apenas pela homepage
 * institucional (src/pages/marketing). Nada aqui é inventado: os números de
 * lojas e produtos vêm de um count() directo às tabelas, e as visualizações
 * vêm de um contador incrementado a cada visita (ver migração 0005).
 */
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { TABLES } from '../supabase/tables';

export interface PlatformStats {
  businesses: number;
  products: number;
  pageViews: number;
}

async function countRows(table: string): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return 0;
  const { count, error } = await supabase!
    .from(table)
    .select('id', { count: 'exact', head: true })
    .is('deleted_at', null);
  if (error) throw error;
  return count ?? 0;
}

export const platformStatsService = {
  /** Números reais para a secção de estatísticas da homepage. */
  async getStats(): Promise<PlatformStats> {
    if (!isSupabaseConfigured || !supabase) {
      return { businesses: 0, products: 0, pageViews: 0 };
    }

    const [businesses, products, statsRow] = await Promise.all([
      countRows(TABLES.BUSINESSES),
      countRows(TABLES.PRODUCTS),
      supabase!.from(TABLES.SITE_STATS).select('page_views').eq('id', 1).maybeSingle(),
    ]);

    return {
      businesses,
      products,
      pageViews: statsRow.data?.page_views ?? 0,
    };
  },

  /**
   * Regista uma visita à homepage. Chamado uma vez por carregamento da
   * página — a contagem real acontece atomicamente no Postgres (ver
   * increment_page_view() na migração 0005), por isso é seguro chamar
   * mesmo com muitos visitantes em simultâneo.
   */
  async registerPageView(): Promise<number | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase!.rpc('increment_page_view');
    if (error) {
      console.error('Não foi possível registar a visita:', error);
      return null;
    }
    return data as number;
  },
};
