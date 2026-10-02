import { motion } from 'motion/react';
import { Palette, MessageCircle, LayoutDashboard, Link2, Layers, MonitorSmartphone } from 'lucide-react';

const BENEFITS = [
  { icon: Palette, title: 'Loja personalizada', text: 'Logótipo e cores da sua marca.', tone: 'bg-blue-50 text-blue-600' },
  { icon: MessageCircle, title: 'Pedidos pelo WhatsApp', text: 'O cliente fala directo consigo.', tone: 'bg-emerald-50 text-emerald-600' },
  { icon: LayoutDashboard, title: 'Painel completo', text: 'Tudo gerido num só lugar.', tone: 'bg-violet-50 text-violet-600' },
  { icon: Link2, title: 'Link exclusivo', text: 'Um endereço só seu para partilhar.', tone: 'bg-sky-50 text-sky-600' },
  { icon: Layers, title: 'Categorias ilimitadas', text: 'Organize o catálogo à sua maneira.', tone: 'bg-amber-50 text-amber-600' },
  { icon: MonitorSmartphone, title: 'Em qualquer dispositivo', text: 'Telemóvel, tablet ou computador.', tone: 'bg-rose-50 text-rose-600' },
];

export default function BenefitsSection() {
  return (
    <section className="relative -mt-8 pb-20 sm:pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="ui-card ui-card-hover rounded-2xl p-4 sm:p-5"
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.tone}`}>
                <b.icon className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-3.5">{b.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
