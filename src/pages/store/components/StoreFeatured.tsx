import { motion } from 'motion/react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function StoreFeatured() {
  const { products, accent, whatsappLink, openProduct } = useStore();
  const featured = products.filter((p) => p.featured && p.status === 'disponivel').slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-[#0b1425] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="flex items-center justify-center p-2 rounded-lg" style={{ backgroundColor: `${accent}22`, color: accent }}>
            <Sparkles size={16} />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Selecionados para si</span>
            <h2 className="font-display font-black text-2xl text-white tracking-tight">Produtos em Destaque</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((product, idx) => {
            const wa = whatsappLink(`Olá, tenho interesse no produto em destaque *${product.name}* (${product.price} MT).`);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => openProduct(product)}
                className="group rounded-2xl glass-card overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all"
              >
                <div className="aspect-square bg-slate-950 overflow-hidden">
                  {product.images[0] && (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-sm text-white line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono font-bold text-sm" style={{ color: accent }}>{product.price} MT</span>
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      >
                        <MessageSquare size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
