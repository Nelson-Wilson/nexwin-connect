import { motion } from 'motion/react';
import { Shirt, UtensilsCrossed, Smartphone, ShoppingBasket, Sparkles, Croissant, Pill, BookOpen } from 'lucide-react';
import SectionIntro from './SectionIntro';

/**
 * Each preview is drawn in CSS (no external images) so the section loads instantly.
 * They illustrate how a store can look in different businesses — the platform
 * uses one catalogue layout with per-store colours and content.
 */
const EXAMPLES = [
  { label: 'Moda', icon: Shirt, name: 'Cantinho da Bianca', accent: '#7c3aed', tiles: ['#ede9fe', '#fce7f3', '#e0e7ff', '#fae8ff'] },
  { label: 'Restaurante', icon: UtensilsCrossed, name: 'Sabor da Casa', accent: '#ea580c', tiles: ['#ffedd5', '#fef3c7', '#fee2e2', '#ffedd5'] },
  { label: 'Eletrónicos', icon: Smartphone, name: 'TecnoMaputo', accent: '#2563eb', tiles: ['#dbeafe', '#e0f2fe', '#e2e8f0', '#dbeafe'] },
  { label: 'Mercado', icon: ShoppingBasket, name: 'Mercado Fresco', accent: '#16a34a', tiles: ['#dcfce7', '#ecfccb', '#fef9c3', '#dcfce7'] },
  { label: 'Cosméticos', icon: Sparkles, name: 'Bella Pele', accent: '#db2777', tiles: ['#fce7f3', '#ffe4e6', '#fae8ff', '#fce7f3'] },
  { label: 'Padaria', icon: Croissant, name: 'Pão Quente', accent: '#b45309', tiles: ['#fef3c7', '#ffedd5', '#fde68a', '#fef3c7'] },
  { label: 'Farmácia', icon: Pill, name: 'Farma Vida', accent: '#0d9488', tiles: ['#ccfbf1', '#d1fae5', '#e0f2fe', '#ccfbf1'] },
  { label: 'Papelaria', icon: BookOpen, name: 'Letras & Cores', accent: '#0f172a', tiles: ['#e2e8f0', '#f1f5f9', '#e0e7ff', '#e2e8f0'] },
];

export default function SegmentsSection() {
  return (
    <section id="exemplos" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Exemplos de lojas"
          title="Uma loja para cada tipo de negócio"
          description="Moda, restauração, mercado, beleza e muito mais. Veja como a sua loja pode ficar."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {EXAMPLES.map((ex, index) => (
            <motion.div
              key={ex.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
              whileHover={{ y: -4 }}
              className="ui-card rounded-2xl overflow-hidden"
            >
              <div className="bg-slate-50 p-3 sm:p-4">
                <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-2.5 py-2 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: ex.accent }} />
                      <span className="text-[9px] font-bold text-slate-800 truncate">{ex.name}</span>
                    </span>
                    <span className="w-6 h-1.5 rounded-full bg-slate-200" />
                  </div>
                  <div className="m-2 h-9 rounded-lg" style={{ background: `linear-gradient(120deg, ${ex.accent}, ${ex.accent}99)` }} />
                  <div className="grid grid-cols-2 gap-1.5 px-2 pb-2">
                    {ex.tiles.map((c, i) => (
                      <div key={i} className="rounded-md border border-slate-100 p-1">
                        <div className="aspect-[4/3] rounded" style={{ backgroundColor: c }} />
                        <div className="h-1 w-3/4 rounded-full bg-slate-200 mt-1" />
                        <div className="h-1 w-1/3 rounded-full mt-1" style={{ backgroundColor: ex.accent }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ex.accent}14`, color: ex.accent }}>
                  <ex.icon className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900">{ex.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
