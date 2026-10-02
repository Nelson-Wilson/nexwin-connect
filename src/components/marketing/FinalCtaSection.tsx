import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 px-6 sm:px-14 py-14 sm:py-16 text-center shadow-2xl shadow-blue-600/25"
        >
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-10 w-72 h-72 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Comece hoje mesmo sua loja online.
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mt-4">Experimente grátis durante 7 dias. Depois, apenas 799 MT por mês.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
              <Link
                to="/registar"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 px-8 py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                Criar minha loja grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full sm:w-auto text-sm font-bold text-white border border-white/30 hover:bg-white/10 px-8 py-4 rounded-xl transition-all"
              >
                Entrar
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
