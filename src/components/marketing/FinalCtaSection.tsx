import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Comece hoje mesmo.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Experimente grátis durante 7 dias. Depois, apenas 799 MT por mês.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Link
              to="/registar"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              Criar Loja Grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-bold text-slate-200 border border-white/10 hover:border-white/25 hover:bg-white/5 px-8 py-4 rounded-xl transition-all"
            >
              Entrar
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
