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
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
        {description && <p className="text-sm text-slate-400">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors shrink-0"
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
    <div className="glass-card rounded-xl p-12 text-center">
      <div className="mx-auto mb-4 text-slate-600">{icon}</div>
      <p className="text-white font-semibold mb-1">{title}</p>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
