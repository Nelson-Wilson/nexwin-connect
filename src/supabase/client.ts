import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    console.log('✅ Supabase inicializado com sucesso.');
  } catch (error) {
    console.error('❌ Falha ao inicializar o Supabase:', error);
  }
} else {
  if (import.meta.env.PROD) {
    console.error('❌ CRÍTICO: Variáveis de ambiente do Supabase não configuradas em produção!');
  } else {
    console.warn('⚠️ Supabase não configurado. A correr em modo de desenvolvimento com fallback.');
  }
}

export { supabase };
