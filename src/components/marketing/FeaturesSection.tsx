import { motion } from 'motion/react';
import {
  UploadCloud, Tags, Search, SlidersHorizontal, Images, MessageCircle, Paintbrush, LayoutDashboard,
  BadgePercent, GalleryHorizontal, Smartphone, Building2, Gauge, MonitorSmartphone, BarChart3, ShieldCheck,
} from 'lucide-react';
import SectionIntro from './SectionIntro';

const TONES = [
  'bg-blue-50 text-blue-600',
  'bg-violet-50 text-violet-600',
  'bg-emerald-50 text-emerald-600',
  'bg-sky-50 text-sky-600',
];

const FEATURES = [
  { icon: UploadCloud, title: 'Upload de Produtos', text: 'Adicione fotos e descrições em segundos.' },
  { icon: Tags, title: 'Categorias', text: 'Organize o catálogo do seu jeito.' },
  { icon: Search, title: 'Pesquisa Inteligente', text: 'Os clientes encontram tudo rapidamente.' },
  { icon: SlidersHorizontal, title: 'Filtros', text: 'Refine por categoria, preço e mais.' },
  { icon: Images, title: 'Galeria de Imagens', text: 'Várias fotos por produto.' },
  { icon: MessageCircle, title: 'WhatsApp Integrado', text: 'Encomendas directas, sem intermediários.' },
  { icon: Paintbrush, title: 'Personalização', text: 'Cores, logótipo e identidade próprios.' },
  { icon: LayoutDashboard, title: 'Painel Administrativo', text: 'Controle tudo num só lugar.' },
  { icon: BadgePercent, title: 'Promoções', text: 'Crie campanhas e descontos facilmente.' },
  { icon: GalleryHorizontal, title: 'Banners', text: 'Destaque o que importa na sua loja.' },
  { icon: Smartphone, title: 'Aplicação (PWA)', text: 'A sua loja instalável no telemóvel.' },
  { icon: Building2, title: 'Multiempresa', text: 'Vários negócios, uma só conta.' },
  { icon: Gauge, title: 'SEO Optimizado', text: 'Seja encontrado no Google.' },
  { icon: MonitorSmartphone, title: 'Responsivo', text: 'Perfeito em qualquer ecrã.' },
  { icon: BarChart3, title: 'Estatísticas', text: 'Acompanhe visitas e vendas.' },
  { icon: ShieldCheck, title: 'Backup Automático', text: 'Os seus dados sempre seguros.' },
];

export default function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Tudo incluído"
          title="Tudo o que precisa para vender online"
          description="Ferramentas simples para gerir e fazer crescer a sua loja, num só lugar."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
              className="ui-card ui-card-hover rounded-2xl p-5"
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${TONES[index % TONES.length]}`}>
                <feature.icon className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-4">{feature.title}</h3>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
