import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, Clock, Sparkles } from 'lucide-react';
import SectionIntro from './SectionIntro';

const FEATURES = [
  'Loja online própria com link exclusivo',
  'Produtos e categorias ilimitados',
  'Encomendas directas pelo WhatsApp',
  'Personalização de cores e logótipo',
  'Painel administrativo completo',
  'Banners, promoções e estatísticas',
];

export default function PricingSection() {
  return (
    <section id="precos" className="py-20 sm:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="Plano" title="Simples e transparente" description="Sem cartão de crédito para começar. Sem letras pequenas." />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md mx-auto rounded-3xl p-[2px] bg-gradient-to-br from-blue-500 via-violet-500 to-blue-600 shadow-2xl shadow-blue-600/20"
        >
          <div className="rounded-[calc(1.5rem-2px)] bg-white p-7 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
                <Clock className="w-3.5 h-3.5" />
                7 dias grátis
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-full px-3 py-1">
                <Sparkles className="w-3 h-3" />
                Recomendado
              </span>
            </div>

            <h3 className="font-display font-extrabold text-slate-900 text-xl mt-5">Comece hoje, sem custos</h3>
            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
              Experimente a plataforma completa durante uma semana. Depois disso, a sua loja continua por uma mensalidade única.
            </p>

            <div className="flex items-baseline gap-1.5 mt-6">
              <span className="font-display font-extrabold text-5xl text-slate-900 tracking-tight">799 MT</span>
              <span className="text-slate-500 text-sm">/ mês, após os 7 dias grátis</span>
            </div>

            <ul className="space-y-3 mt-7">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/registar"
              className="block text-center text-sm font-bold rounded-xl py-4 mt-8 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]"
            >
              Criar minha loja grátis
            </Link>
            <p className="text-slate-400 text-xs text-center mt-3">
              Cancele em qualquer momento durante o período gratuito, sem cobrança.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
