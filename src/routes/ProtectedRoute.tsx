import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] flex-col gap-4">
        <div className="w-10 h-10 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">A verificar sessão...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
