import { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { SlidersHorizontal, SearchX, ArrowDownUp } from 'lucide-react';
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

  return (
    <section id="catalogo" className="bg-[#f3f7ff] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Todos os produtos</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 sm:text-4xl">Catálogo</h2>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm md:self-auto">
            <ArrowDownUp size={14} className="text-slate-500" />
            <select
              id="store-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent pr-1 text-sm font-medium text-slate-700 focus:outline-none"
            >
              <option value="default">Ordenar por: Mais recentes</option>
              <option value="price-asc">Preço: menor para maior</option>
              <option value="price-desc">Preço: maior para menor</option>
              <option value="name-asc">Nome: A - Z</option>
              <option value="newest">Mais recentes</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:sticky lg:top-24">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}14`, color: accent }}>
                <SlidersHorizontal size={16} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Categorias</h3>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onCategorySelect('todos')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  selectedCategory === 'todos' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Todas</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.name).length;
                const active = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <label htmlFor="store-price">Preço</label>
                <span className="text-slate-800">{priceRange} MT</span>
              </div>
              <input
                id="store-price"
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-600"
                style={{ color: accent }}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>0 MT</span>
                <span>{maxPrice} MT</span>
              </div>
            </div>
          </aside>

          <div>
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
                <div className="mx-auto max-w-md rounded-[28px] border border-slate-200 bg-white py-16 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <SearchX size={28} />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-900">Nenhum produto encontrado</h3>
                  <p className="mt-2 px-8 text-sm text-slate-500">Tente limpar os filtros ou alterar a pesquisa.</p>
                  <button
                    onClick={() => {
                      setPriceRange(maxPrice);
                      onCategorySelect('todos');
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
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
