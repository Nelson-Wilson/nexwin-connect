import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Store, MessageCircle, Sparkles } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

const DEMO_STORE_URL = 'https://nexwin-connect.vercel.app/loja/nextwin';

export default function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useTilt(containerRef);

  return (
    <section id="exemplos" className="py-20 sm:py-28 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 inline-flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            Loja de demonstração
          </span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Veja a NexWin Connect <span className="font-sans font-black not-italic tracking-tighter uppercase">em acção</span>
          </h2>
          <p className="text-slate-400 font-light mt-3 text-sm sm:text-base">
            Uma loja real, criada na plataforma, para explorar antes de criar a sua.
          </p>
        </div>

        <div ref={containerRef} className="flex justify-center">
          <motion.a
            href={DEMO_STORE_URL}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="tilt-card group block w-full max-w-2xl glass-card glass-card-hover rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 border-b border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 text-[10px] text-slate-500 font-mono truncate">
                nexwin-connect.vercel.app/loja/nextwin
              </span>
            </div>

            <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-600/25 shrink-0">
                <span className="font-display font-bold text-white text-2xl">NX</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-display font-semibold text-white text-lg">Loja NexWin</h3>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                  Explore o catálogo, os produtos e o botão de encomenda directa pelo
                  WhatsApp — exactamente como os seus clientes vão ver a sua loja.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 text-xs font-medium mt-3">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Encomendas via WhatsApp activas
                </div>
              </div>
              <span className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              </span>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
