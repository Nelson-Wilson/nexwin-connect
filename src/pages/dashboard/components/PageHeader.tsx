import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';

export function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] shrink-0 self-start"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="ui-card rounded-xl p-12 text-center">
      <div className="mx-auto mb-4 text-slate-400">{icon}</div>
      <p className="text-slate-900 font-semibold mb-1">{title}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
