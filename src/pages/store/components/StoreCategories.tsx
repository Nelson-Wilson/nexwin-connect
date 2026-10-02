import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCategoryIcon } from '../../dashboard/components/iconRegistry';

export default function StoreCategories({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const { categories, products, accent } = useStore();

  if (categories.length === 0) return null;

  const handleClick = (name: string) => {
    onCategorySelect(name);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categorias" className="bg-[#f3f7ff] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Categorias em destaque</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 sm:text-4xl">Explore por estilo</h2>
          </div>
          <button type="button" onClick={() => handleClick('todos')} className="hidden items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900 sm:inline-flex">
            Ver todas as categorias <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.icon);
            const count = products.filter((p) => p.category === cat.name).length;
            const color = cat.color ?? accent;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                onClick={() => handleClick(cat.name)}
                className="group flex h-full flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-4 text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)]"
              >
                <div className="flex h-32 items-center justify-center rounded-[20px] border border-slate-100 bg-slate-50">
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}1A`, color }}>
                    <Icon size={34} />
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xl font-extrabold tracking-[-0.04em] text-slate-900">{cat.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{count} produto{count === 1 ? '' : 's'}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
