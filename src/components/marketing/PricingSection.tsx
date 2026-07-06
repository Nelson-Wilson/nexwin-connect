import { useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, Clock } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

const FEATURES = [
  'Loja online própria com link exclusivo',
  'Produtos e categorias ilimitados',
  'Encomendas directas pelo WhatsApp',
  'Personalização de cores e logótipo',
  'Painel administrativo completo',
  'Banners, promoções e estatísticas',
];

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useTilt(containerRef);

  return (
    <section id="precos" className="py-20 sm:py-28 bg-[#0F172A] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Plano</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Simples, <span className="font-sans font-black not-italic tracking-tighter uppercase">transparente</span>
          </h2>
          <p className="text-slate-400 font-light mt-3 text-sm sm:text-base">
            Sem cartão de crédito para começar. Sem letras pequenas.
          </p>
        </div>

        <div ref={containerRef} className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="tilt-card w-full max-w-md rounded-2xl p-8 bg-gradient-to-br from-blue-600/20 to-blue-900/30 border border-blue-500/30 shadow-2xl shadow-blue-600/10"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 rounded-full px-3 py-1">
              <Clock className="w-3 h-3" />
              7 dias grátis
            </span>

            <h3 className="font-display font-bold text-white text-xl mt-4">Comece hoje, sem custos</h3>
            <p className="text-slate-400 text-sm mt-1.5">
              Experimente a plataforma completa durante uma semana. Depois disso, a sua loja continua por uma mensalidade única.
            </p>

            <div className="flex items-baseline gap-1.5 mt-6">
              <span className="font-display font-bold text-4xl text-white">799 MT</span>
              <span className="text-slate-500 text-sm">/ mês, após os 7 dias grátis</span>
            </div>

            <ul className="space-y-3 mt-6">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/registar"
              className="block text-center text-sm font-bold rounded-xl py-3.5 mt-8 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
            >
              Criar Loja Grátis
            </Link>
            <p className="text-slate-500 text-[11px] text-center mt-3">
              Cancele em qualquer momento durante o período gratuito, sem cobrança.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
