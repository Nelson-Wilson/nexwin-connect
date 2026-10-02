import { motion } from 'motion/react';
import { ShoppingBag, MessageSquare, ChevronDown, Store as StoreIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_TYPE_LABELS } from '../../../models/business.model';

export default function StoreHero({ onExploreClick }: { onExploreClick: () => void }) {
  const { business, accent, whatsappLink } = useStore();
  const wa = whatsappLink('Olá! Vim do catálogo e gostaria de fazer uma encomenda.');

  return (
    <section id="inicio" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24 bg-white">
      {/* Soft wash in the store's own accent colour */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${accent}14 0%, ${accent}05 55%, transparent 100%)` }} />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[420px] rounded-full blur-[120px] opacity-25" style={{ backgroundColor: accent }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 text-center">
        {business.banner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl mx-auto aspect-[21/9] rounded-3xl overflow-hidden mb-10 border border-slate-200 shadow-xl shadow-slate-900/10"
          >
            <img src={business.banner} alt={business.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-5 bg-white"
          style={{ borderColor: `${accent}40`, color: accent }}
        >
          <StoreIcon size={12} />
          {BUSINESS_TYPE_LABELS[business.businessType]}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 leading-[1.08]"
        >
          {business.name}
        </motion.h1>

        {business.description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mt-5"
          >
            {business.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-8"
        >
          <button
            onClick={onExploreClick}
            className="flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] text-sm"
            style={{ backgroundColor: accent, boxShadow: `0 10px 24px -8px ${accent}99` }}
          >
            <ShoppingBag size={18} />
            Explorar Catálogo
          </button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-bold px-8 py-4 rounded-xl transition-all text-sm"
            >
              <MessageSquare size={18} className="text-emerald-500" />
              Falar no WhatsApp
            </a>
          )}
        </motion.div>
      </div>

      <button
        type="button"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
        onClick={onExploreClick}
        aria-label="Ver catálogo"
      >
        <span className="text-xs text-slate-400 font-medium">Ver catálogo</span>
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="text-slate-400">
          <ChevronDown size={20} />
        </motion.span>
      </button>
    </section>
  );
}
