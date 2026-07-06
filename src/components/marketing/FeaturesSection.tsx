import { useRef } from 'react';
import { motion } from 'motion/react';
import {
  UploadCloud,
  Tags,
  Search,
  SlidersHorizontal,
  Images,
  MessageCircle,
  Paintbrush,
  LayoutDashboard,
  BadgePercent,
  GalleryHorizontal,
  Smartphone,
  Building2,
  Gauge,
  MonitorSmartphone,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

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
  const containerRef = useRef<HTMLDivElement>(null);
  useTilt(containerRef);

  return (
    <section id="funcionalidades" className="py-20 sm:py-28 bg-[#0B1120] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Tudo incluído</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Funcionalidades <span className="font-sans font-black not-italic tracking-tighter uppercase">completas</span>
          </h2>
          <p className="text-slate-400 font-light mt-3 text-sm sm:text-base">
            Tudo o que precisa para gerir e fazer crescer a sua loja, num só lugar.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 perspective-1000">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
              className="tilt-card glass-card glass-card-hover rounded-2xl p-5"
            >
              <feature.icon className="w-5 h-5 text-blue-400 mb-3" />
              <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
