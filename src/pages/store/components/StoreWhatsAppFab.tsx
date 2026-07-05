import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function StoreWhatsAppFab() {
  const { whatsappLink } = useStore();
  const wa = whatsappLink('Olá! Estou a ver o catálogo e gostaria de fazer uma pergunta.');
  if (!wa) return null;

  return (
    <a
      href={wa}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-emerald-500/30 group"
      title="Falar no WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
}
