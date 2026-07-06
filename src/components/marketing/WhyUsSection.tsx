import { useRef } from 'react';
import { motion } from 'motion/react';
import { Zap, MonitorSmartphone, Code2, LayoutPanelLeft, ShieldCheck, Cloud, RefreshCw, Headset } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

const REASONS = [
  { icon: Zap, title: 'Criação rápida', text: 'A sua loja fica pronta em minutos, não em semanas.' },
  { icon: MonitorSmartphone, title: '100% Responsivo', text: 'Perfeita em qualquer telemóvel, tablet ou computador.' },
  { icon: Code2, title: 'Sem programação', text: 'Não precisa de saber nada de tecnologia para começar.' },
  { icon: LayoutPanelLeft, title: 'Painel Administrativo', text: 'Gerir produtos, banners e encomendas é simples e intuitivo.' },
  { icon: ShieldCheck, title: 'Seguro', text: 'Os dados da sua loja e dos seus clientes estão protegidos.' },
  { icon: Cloud, title: 'Hospedagem na Cloud', text: 'A sua loja está sempre online, sem preocupações técnicas.' },
  { icon: RefreshCw, title: 'Actualizações constantes', text: 'Novas funcionalidades chegam sem custo adicional.' },
  { icon: Headset, title: 'Suporte', text: 'Estamos disponíveis para ajudar sempre que precisar.' },
];

export default function WhyUsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useTilt(containerRef);

  return (
    <section className="py-20 sm:py-28 bg-[#0B1120] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Vantagens</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Porque escolher a <span className="font-sans font-black not-italic tracking-tighter uppercase">NexWin Connect</span>
          </h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 perspective-1000">
          {REASONS.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
              className="tilt-card rounded-2xl border border-white/5 p-6 hover:border-blue-500/30 hover:bg-white/[0.02] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600/15 flex items-center justify-center mb-4">
                <reason.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-display font-semibold text-white text-sm">{reason.title}</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">{reason.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
