import { supabase, isSupabaseConfigured } from './client';

// ─── Production: Supabase Auth only ────────────────────────────────────────
// ─── Development fallback: localStorage simulation (DEV only) ─────────────
const IS_PROD = import.meta.env.PROD;
const FALLBACK_AUTH_KEY = 'malambe_admin_logged';

export const loginUser = async (email: string, pass: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      console.error('Supabase authentication failed:', error);
      const code = (error as any).code as string | undefined;
      if (
        code === 'invalid_credentials' ||
        error.message?.toLowerCase().includes('invalid login credentials')
      ) {
        throw new Error('Email ou senha inválidos.');
      }
      if (code === 'over_request_rate_limit' || error.status === 429) {
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      }
      throw new Error('Erro de autenticação. Verifique sua conexão.');
    }
    return true;
  }

  if (IS_PROD) {
    throw new Error('Sistema de autenticação não configurado. Contacte o administrador.');
  }

  // DEV fallback only
  const isSuccess = email === 'admin@malambeemoda.com' && pass === 'admin123';
  if (isSuccess) {
    localStorage.setItem(FALLBACK_AUTH_KEY, 'true');
    return true;
  }
  throw new Error('Credenciais inválidas.');
};

export const logoutUser = async (): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return;
  }
  if (!IS_PROD) {
    localStorage.removeItem(FALLBACK_AUTH_KEY);
  }
};

export const subscribeToAuthChanges = (
  callback: (user: { email: string | null } | null) => void
) => {
  if (isSupabaseConfigured && supabase) {
    // Emite o estado inicial imediatamente (equivalente ao comportamento
    // síncrono equivalente ao onAuthStateChanged do Firebase, para a sessão já persistida)
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      callback(user ? { email: user.email ?? null } : null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      callback(user ? { email: user.email ?? null } : null);
    });
    return () => subscription.subscription.unsubscribe();
  }

  if (!IS_PROD) {
    const isLogged = localStorage.getItem(FALLBACK_AUTH_KEY) === 'true';
    callback(isLogged ? { email: 'admin@malambeemoda.com' } : null);
  } else {
    callback(null);
  }
  return () => {};
};

export const isUserLoggedIn = (): boolean => {
  if (!IS_PROD) {
    return localStorage.getItem(FALLBACK_AUTH_KEY) === 'true';
  }
  return false;
};

/**
 * Changes the fallback password used in development mode.
 * In production (Supabase configured), this is a no-op — passwords are
 * managed through the Supabase Dashboard (Authentication → Users).
 */
export const changeAdminFallbackPassword = (newPass: string): void => {
  if (IS_PROD || isSupabaseConfigured) {
    console.warn('changeAdminFallbackPassword: no-op in production. Manage passwords via Supabase Dashboard.');
    return;
  }
  // DEV only: store in sessionStorage (resets on tab close, safer than localStorage)
  sessionStorage.setItem('malambe_dev_pass', newPass);
};

export { isSupabaseConfigured };
