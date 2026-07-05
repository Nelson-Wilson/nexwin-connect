import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, MessageSquare, Info, Share2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { filterAndSortProducts, type SortOption } from '../lib/filterProducts';
import type { StoreProduct } from '../../../models/product.model';

export default function StoreCatalogue({
  selectedCategory,
  onCategorySelect,
  searchText,
}: {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  searchText: string;
}) {
  const { products, categories, accent, business, whatsappLink, openProduct } = useStore();
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const maxPrice = useMemo(() => Math.max(1, ...products.map((p) => p.price)), [products]);
  const [priceRange, setPriceRange] = useState(maxPrice);

  const filtered = useMemo(
    () => filterAndSortProducts(products, { category: selectedCategory, search: searchText, maxPrice: priceRange, sort: sortOption }),
    [products, selectedCategory, priceRange, searchText, sortOption]
  );

  const handleShare = (e: React.MouseEvent, product: StoreProduct) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/loja/${business.slug}?prod=${product.id}`;
    if (navigator.share) {
      navigator.share({ title: product.name, text: `Vê este produto na loja ${business.name}!`, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const orderLink = (product: StoreProduct) =>
    whatsappLink(
      `Olá, tenho interesse no produto *${product.name}*.\nPreço: ${product.price} MT\nStatus: ${product.status === 'disponivel' ? 'Disponível' : 'Esgotado'}`
    );

  return (
    <section id="catalogo" className="py-16 bg-[#0F172A] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Montra Digital</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl mt-2 text-white tracking-tight">Produtos</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategorySelect('todos')}
              className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
              style={selectedCategory === 'todos' ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#0f1a2e', color: '#94a3b8' }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.name)}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                style={selectedCategory === cat.name ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#0f1a2e', color: '#94a3b8' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <SlidersHorizontal size={15} style={{ color: accent }} />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Filtros</h3>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Preço máximo</span>
                <span className="font-mono">{priceRange} MT</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-current"
                style={{ color: accent }}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Ordenar por</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="default">Padrão</option>
                <option value="price-asc">Preço: Menor para Maior</option>
                <option value="price-desc">Preço: Maior para Menor</option>
                <option value="name-asc">Nome: A - Z</option>
                <option value="newest">Mais Recentes</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-9">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filtered.map((product, index) => {
                    const wa = orderLink(product);
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                        onClick={() => openProduct(product)}
                        className="group flex flex-col h-full rounded-2xl glass-card overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                      >
                        <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                              <Info size={28} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                            {product.status === 'esgotado' ? (
                              <span className="bg-red-600 text-white font-display font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">Esgotado</span>
                            ) : (
                              <>
                                {product.news && <span className="bg-blue-600 text-white font-display font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">Novo</span>}
                                {product.bestseller && <span className="bg-amber-500 text-slate-950 font-display font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">Mais Vendido</span>}
                              </>
                            )}
                          </div>

                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={(e) => handleShare(e, product)} className="p-2 rounded-full bg-slate-950/90 text-slate-300 hover:text-blue-400 border border-slate-800 shadow-md transition-all">
                              <Share2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col flex-grow justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{product.category}</span>
                            <h3 className="font-display font-bold text-sm text-slate-100 mt-1 line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-slate-400 font-light mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-900/80 flex items-center justify-between">
                            <div className="flex flex-col">
                              {product.originalPrice && <span className="text-[10px] text-slate-500 line-through">{product.originalPrice} MT</span>}
                              <span className="font-display font-bold text-base font-mono" style={{ color: accent }}>{product.price} MT</span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); openProduct(product); }}
                                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:text-white transition-all"
                              >
                                <Info size={14} />
                              </button>
                              {wa && (
                                <a
                                  href={wa}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    product.status === 'esgotado' ? 'bg-slate-900 text-slate-500 pointer-events-none' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  }`}
                                >
                                  <MessageSquare size={13} />
                                  Pedir
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center rounded-2xl glass-card max-w-md mx-auto space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-slate-950 text-slate-500 border border-slate-900">
                    <AlertCircle size={28} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-200">Nenhum produto encontrado</h3>
                  <p className="text-xs text-slate-400 px-6 font-light">Tente limpar os filtros ou alterar a sua pesquisa.</p>
                  <button
                    onClick={() => { setPriceRange(maxPrice); onCategorySelect('todos'); }}
                    className="px-4 py-2 text-white font-semibold text-xs rounded-lg transition-all"
                    style={{ backgroundColor: accent }}
                  >
                    Restaurar Filtros
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
