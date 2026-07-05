import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { businessService } from '../services/businessService';
import type { PlatformUser } from '../models/user.model';

export interface AuthContextValue {
  user: User | null;
  platformUser: PlatformUser | null;
  /** true while the initial auth check (or a sign-up/login flow) is running */
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Creates the business + platform profile for an authenticated user that
 * doesn't have one yet. This is the ONE place that does this, called from
 * two moments:
 *   1) Right after signUp(), when Supabase already returns an active
 *      session (email confirmation disabled) — the common case.
 *   2) From the auth-state subscription, the first time a user shows up
 *      authenticated but with no profile row yet — covers the case where
 *      email confirmation IS required, so signUp() returns no session and
 *      step 1 can't run; the profile then gets created here on the user's
 *      first real login, after they confirm their email.
 * Idempotent: if a profile already exists for this uid, it's returned as-is.
 *
 * IMPORTANT: signUp() calling this directly AND the onAuthStateChange
 * listener (below) firing for the same SIGNED_IN event both race to call
 * this for the same brand-new user. Without a lock, both would see
 * "no profile yet" and each create their own business — two orphaned
 * businesses for one user. `inFlight` makes concurrent calls for the same
 * uid share a single creation instead of duplicating it.
 */
const inFlight = new Map<string, Promise<PlatformUser>>();

async function ensureProfile(authUser: User): Promise<PlatformUser> {
  const existing = await userService.getByUid(authUser.id);
  if (existing) return existing;

  const pending = inFlight.get(authUser.id);
  if (pending) return pending;

  const creation = (async (): Promise<PlatformUser> => {
    // Re-check after joining the "lock" — another caller may have just
    // finished creating the profile while we were doing the first check.
    const raceCheck = await userService.getByUid(authUser.id);
    if (raceCheck) return raceCheck;

    const name = (authUser.user_metadata?.display_name as string) || authUser.email || 'Minha Loja';
    const business = await businessService.createDraftForOwner(authUser.id, name);
    const profile: PlatformUser = {
      uid: authUser.id,
      name,
      email: authUser.email ?? '',
      businessId: business.id,
      role: 'owner',
      createdAt: new Date().toISOString(),
    };
    await userService.create(profile);
    return profile;
  })();

  inFlight.set(authUser.id, creation);
  try {
    return await creation;
  } finally {
    inFlight.delete(authUser.id);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribe(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const profile = await ensureProfile(authUser);
          setPlatformUser(profile);
        } catch (err) {
          console.error('Falha ao carregar/criar perfil do utilizador:', err);
          setPlatformUser(null);
        }
      } else {
        setPlatformUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { user: authUser, session } = await authService.registerAccount(name, email, password);

      if (!session) {
        // Confirmação de email ativa no projeto Supabase: a conta foi criada,
        // mas ainda não há sessão — não dá para criar a loja agora (RLS
        // exige auth.uid()). Vai ser criada automaticamente no primeiro
        // login, depois de o utilizador confirmar o email (ver ensureProfile
        // acima, chamado pela subscrição de auth state).
        setLoading(false);
        throw new Error(
          'Conta criada! Verifique o seu email para confirmar antes de iniciar sessão.'
        );
      }

      // Já há sessão ativa (confirmação de email desligada) — cria a loja
      // e o perfil imediatamente, para o /onboarding já encontrar tudo pronto.
      const profile = await ensureProfile(authUser);
      setUser(authUser);
      setPlatformUser(profile);
    } finally {
      setLoading(false);
    }
  }, []);

  const logIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.logIn(email, password);
      // onAuthStateChange subscription above takes care of loading (ou
      // criando, se ainda não existir) o perfil.
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }, []);

  const logOut = useCallback(async () => {
    await authService.logOut();
    setUser(null);
    setPlatformUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await authService.sendPasswordReset(email);
  }, []);

  const value: AuthContextValue = {
    user,
    platformUser,
    loading,
    signUp,
    logIn,
    logOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
