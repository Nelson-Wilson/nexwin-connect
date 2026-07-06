import { useRef } from 'react';
import { motion } from 'motion/react';
import {
  Shirt,
  UtensilsCrossed,
  Croissant,
  CakeSlice,
  IceCreamCone,
  BookOpen,
  Sparkles,
  Smartphone,
  Pill,
  ShoppingBasket,
  Gem,
  MoreHorizontal,
} from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

const SEGMENTS = [
  {
    label: 'Moda',
    icon: Shirt,
    bgImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Restaurante',
    icon: UtensilsCrossed,
    bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Padaria',
    icon: Croissant,
    bgImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Confeitaria',
    icon: CakeSlice,
    bgImage: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Sorveteria',
    icon: IceCreamCone,
    bgImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Papelaria',
    icon: BookOpen,
    bgImage: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Cosméticos',
    icon: Sparkles,
    bgImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Eletrónicos',
    icon: Smartphone,
    bgImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Farmácia',
    icon: Pill,
    bgImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Mercado',
    icon: ShoppingBasket,
    bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Boutique',
    icon: Gem,
    bgImage: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Outros',
    icon: MoreHorizontal,
    bgImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
  },
];

export default function SegmentsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useTilt(containerRef);

  return (
    <section className="py-20 sm:py-24 bg-[#0F172A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Para todos os negócios</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Qualquer negócio pode <span className="font-sans font-black not-italic tracking-tighter uppercase">vender online</span>
          </h2>
          <p className="text-slate-400 font-light mt-3 text-sm sm:text-base">
            Da moda à padaria, a NexWin Connect adapta-se ao seu tipo de negócio.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 perspective-1000">
          {SEGMENTS.map((segment, index) => (
            <motion.div
              key={segment.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
              className="tilt-card group relative h-36 sm:h-40 rounded-2xl overflow-hidden cursor-default bg-slate-900 border border-slate-800/80 preserve-3d transition-all duration-500 hover:border-blue-500/40 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={segment.bgImage}
                  alt={segment.label}
                  className="w-full h-full object-cover opacity-40 group-hover:scale-110 group-hover:opacity-25 transition-all duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between">
                <div className="w-9 h-9 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 translate-z-20">
                  <segment.icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white translate-z-20">{segment.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
