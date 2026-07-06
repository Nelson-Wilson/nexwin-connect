/**
 * Platform authentication service (Supabase Auth).
 *
 * This is separate from `src/supabase/auth.ts`, which powers the legacy
 * single-admin login for the existing catalogue and must stay untouched.
 */
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../supabase/client';

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase não está configurado. Verifique as variáveis VITE_SUPABASE_* no .env.local.'
    );
  }
}

function friendlyAuthError(error: any): Error {
  const code = error?.code as string | undefined;
  const message = (error?.message as string | undefined)?.toLowerCase() ?? '';

  const map: Record<string, string> = {
    user_already_exists: 'Este email já está registado. Tente iniciar sessão.',
    email_exists: 'Este email já está registado. Tente iniciar sessão.',
    validation_failed: 'Email inválido.',
    weak_password: 'A senha deve ter pelo menos 6 caracteres.',
    invalid_credentials: 'Email ou senha inválidos.',
    over_request_rate_limit: 'Muitas tentativas. Tente novamente mais tarde.',
  };

  if (code && map[code]) return new Error(map[code]);
  if (message.includes('already registered') || message.includes('already exists')) {
    return new Error('Este email já está registado. Tente iniciar sessão.');
  }
  if (message.includes('invalid login credentials')) {
    return new Error('Email ou senha inválidos.');
  }
  if (message.includes('password should be at least')) {
    return new Error('A senha deve ter pelo menos 6 caracteres.');
  }
  if (message.includes('rate limit')) {
    return new Error('Muitas tentativas. Tente novamente mais tarde.');
  }
  return new Error('Ocorreu um erro. Verifique a sua ligação e tente novamente.');
}

export const authService = {
  /** Creates the Supabase Auth account only. Business/user rows are created by AuthContext. */
  async registerAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User; session: import('@supabase/supabase-js').Session | null }> {
    assertConfigured();
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    if (error) throw friendlyAuthError(error);
    if (!data.user) throw new Error('Falha ao criar conta. Tente novamente.');
    return { user: data.user, session: data.session };
  },

  async logIn(email: string, password: string): Promise<User> {
    assertConfigured();
    const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) throw friendlyAuthError(error);
    return data.user;
  },

  async logOut(): Promise<void> {
    assertConfigured();
    const { error } = await supabase!.auth.signOut();
    if (error) throw friendlyAuthError(error);
  },

  async sendPasswordReset(email: string): Promise<void> {
    assertConfigured();
    const { error } = await supabase!.auth.resetPasswordForEmail(email);
    if (error) throw friendlyAuthError(error);
  },

  /**
   * IMPORTANTE: só usamos o listener onAuthStateChange, que já dispara
   * imediatamente com a sessão actual (evento INITIAL_SESSION) ao
   * subscrever. Chamar TAMBÉM getSession().then(callback) aqui, como
   * antes, disparava o callback duas vezes quase ao mesmo tempo em cada
   * carregamento da app — e essas duas chamadas concorrentes a
   * ensureProfile() (em AuthContext) podiam, em condições de rede lentas,
   * criar duas lojas para o mesmo utilizador, deixando a conta ligada a
   * um rascunho vazio em vez da loja publicada. Ver migração 0006 para o
   * bloqueio ao nível da base de dados que impede isto de acontecer de
   * novo mesmo que o timing no browser volte a coincidir.
   */
  subscribe(callback: (user: User | null) => void): () => void {
    if (!isSupabaseConfigured || !supabase) {
      callback(null);
      return () => {};
    }
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  },
};
