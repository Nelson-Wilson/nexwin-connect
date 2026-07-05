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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribe(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const profile = await userService.getByUid(authUser.id);
          setPlatformUser(profile);
        } catch (err) {
          console.error('Falha ao carregar perfil do utilizador:', err);
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
      // 1) Supabase Auth account
      const authUser = await authService.registerAccount(name, email, password);
      // 2) Business auto-created in "onboarding" status (Wizard fills the rest)
      const business = await businessService.createDraftForOwner(authUser.id, name);
      // 3) Platform user profile, linked to the new business
      const profile: PlatformUser = {
        uid: authUser.id,
        name,
        email,
        businessId: business.id,
        role: 'owner',
        createdAt: new Date().toISOString(),
      };
      await userService.create(profile);
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
      // onAuthStateChange subscription above takes care of loading the profile
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
