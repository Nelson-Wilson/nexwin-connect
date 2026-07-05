import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Eliminar',
  danger = true,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth="max-w-sm">
      <div className="flex gap-3 mb-6">
        <div
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
            danger ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
          }`}
        >
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-slate-300 pt-2">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
            danger ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
