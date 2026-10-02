import { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { SlidersHorizontal, SearchX } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { filterAndSortProducts, type SortOption } from '../lib/filterProducts';
import type { StoreProduct } from '../../../models/product.model';
import StoreProductCard from './StoreProductCard';

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

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
      active ? 'text-white border-transparent shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
    }`;

  return (
    <section id="catalogo" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-sm font-semibold" style={{ color: accent }}>Montra digital</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-1 text-slate-900 tracking-tight">Produtos</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap pb-1">
            <button
              onClick={() => onCategorySelect('todos')}
              className={`${chip(selectedCategory === 'todos')} shrink-0`}
              style={selectedCategory === 'todos' ? { backgroundColor: accent } : undefined}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.name)}
                className={`${chip(selectedCategory === cat.name)} shrink-0`}
                style={selectedCategory === cat.name ? { backgroundColor: accent } : undefined}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <SlidersHorizontal size={16} style={{ color: accent }} />
              <h3 className="font-display font-bold text-sm text-slate-900">Filtros</h3>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-3">
                <label htmlFor="store-price">Preço máximo</label>
                <span className="font-bold text-slate-900">{priceRange} MT</span>
              </div>
              <input
                id="store-price"
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
              <label htmlFor="store-sort" className="block text-xs text-slate-500 mb-2">Ordenar por</label>
              <select
                id="store-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-slate-400"
              >
                <option value="default">Padrão</option>
                <option value="price-asc">Preço: Menor para Maior</option>
                <option value="price-desc">Preço: Maior para Menor</option>
                <option value="name-asc">Nome: A - Z</option>
                <option value="newest">Mais Recentes</option>
              </select>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {filtered.map((product, index) => (
                    <StoreProductCard
                      key={product.id}
                      product={product}
                      accent={accent}
                      orderHref={orderLink(product)}
                      onOpen={() => openProduct(product)}
                      onShare={(e) => handleShare(e, product)}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 max-w-md mx-auto space-y-4 shadow-sm">
                  <div className="inline-flex p-3.5 rounded-full bg-slate-100 text-slate-400">
                    <SearchX size={28} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900">Nenhum produto encontrado</h3>
                  <p className="text-sm text-slate-500 px-6">Tente limpar os filtros ou alterar a sua pesquisa.</p>
                  <button
                    onClick={() => { setPriceRange(maxPrice); onCategorySelect('todos'); }}
                    className="px-5 py-2.5 text-white font-bold text-sm rounded-xl transition-all active:scale-95"
                    style={{ backgroundColor: accent }}
                  >
                    Restaurar filtros
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
