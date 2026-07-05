import { motion } from 'motion/react';
import { ShoppingBag, MessageSquare, ChevronDown, Store as StoreIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_TYPE_LABELS } from '../../../models/business.model';

export default function StoreHero({ onExploreClick }: { onExploreClick: () => void }) {
  const { business, accent, whatsappLink } = useStore();
  const wa = whatsappLink('Olá! Vim do catálogo e gostaria de fazer uma encomenda.');

  return (
    <section id="inicio" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0F172A] pt-24">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full blur-[130px] opacity-20"
          style={{ backgroundColor: accent }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 text-center">
        {business.banner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-3xl mx-auto aspect-[21/9] rounded-3xl overflow-hidden mb-10 border border-white/10 shadow-2xl"
          >
            <img src={business.banner} alt={business.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
          style={{ backgroundColor: `${accent}1a`, borderColor: `${accent}33`, color: accent }}
        >
          <StoreIcon size={11} />
          {BUSINESS_TYPE_LABELS[business.businessType]}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter text-white leading-tight"
        >
          {business.name}
        </motion.h1>

        {business.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-light leading-relaxed mt-5"
          >
            {business.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
            style={{ backgroundColor: accent }}
          >
            <ShoppingBag size={18} />
            Explorar Catálogo
          </button>

          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold px-8 py-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 text-sm"
            >
              <MessageSquare size={18} className="text-emerald-500" />
              Falar no WhatsApp
            </a>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={onExploreClick}>
        <span className="text-[10px] tracking-widest uppercase text-slate-500 font-medium">Ver Catálogo</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-slate-400">
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
}
