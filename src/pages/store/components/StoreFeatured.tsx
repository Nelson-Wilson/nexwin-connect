import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import StoreProductCard from './StoreProductCard';

export default function StoreFeatured() {
  const { products, accent, whatsappLink, openProduct } = useStore();
  const featured = products.filter((p) => p.featured && p.status === 'disponivel').slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
            <Sparkles size={18} />
          </span>
          <div>
            <span className="text-sm font-semibold" style={{ color: accent }}>Selecionados para si</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">Produtos em destaque</h2>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {featured.map((product, idx) => (
            <StoreProductCard
              key={product.id}
              product={product}
              accent={accent}
              orderHref={whatsappLink(`Olá, tenho interesse no produto em destaque *${product.name}* (${product.price} MT).`)}
              onOpen={() => openProduct(product)}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
