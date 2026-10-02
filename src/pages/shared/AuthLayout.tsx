import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { PLATFORM_NAME, PLATFORM_TAGLINE } from '../../config/platform';

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow, consistent with the catalogue's premium look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Store size={18} className="text-slate-900" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900">{PLATFORM_NAME}</span>
        </Link>

        <div className="ui-card rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-slate-900 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mb-6">{subtitle}</p>}
          {!subtitle && <div className="mb-6" />}
          {children}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6 tracking-wide">
          {PLATFORM_TAGLINE}
        </p>
      </div>
    </div>
  );
}
