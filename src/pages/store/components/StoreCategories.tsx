import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { getCategoryIcon } from '../../dashboard/components/iconRegistry';

export default function StoreCategories({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const { categories, products } = useStore();

  if (categories.length === 0) return null;

  const handleClick = (name: string) => {
    onCategorySelect(name);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categorias" className="py-16 bg-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Navegue pelas Secções</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-2 tracking-tight">Categorias</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.icon);
            const count = products.filter((p) => p.category === cat.name).length;
            const color = cat.color ?? '#2563eb';
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => handleClick(cat.name)}
                className="group flex flex-col items-center gap-3 rounded-2xl glass-card p-6 hover:-translate-y-1 hover:border-slate-700 transition-all"
              >
                <span
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}22`, color }}
                >
                  <Icon size={24} />
                </span>
                <div className="text-center">
                  <p className="font-display font-bold text-sm text-white">{cat.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{count} produto{count === 1 ? '' : 's'}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
