import type { ReactNode } from 'react';

export const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors';

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
    </div>
  );
}
