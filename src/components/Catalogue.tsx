import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, MessageSquare, Info, Share2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import VanillaTilt from 'vanilla-tilt';

interface CatalogueProps {
  products: Product[];
  selectedCategory: 'todos' | 'vestuario' | 'calcados' | 'sorvete';
  onCategorySelect: (category: 'todos' | 'vestuario' | 'calcados' | 'sorvete') => void;
  onProductClick: (product: Product) => void;
  searchText: string;
}

export default function Catalogue({
  products,
  selectedCategory,
  onCategorySelect,
  onProductClick,
  searchText
}: CatalogueProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('todos');
  const [sortOption, setSortOption] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<number>(6000);

  // Initialize Vanilla-Tilt on product cards whenever the view updates
  useEffect(() => {
    const cards = document.querySelectorAll('.catalogue-tilt');
    VanillaTilt.init(Array.from(cards) as HTMLElement[], {
      max: 10,
      speed: 300,
      glare: true,
      'max-glare': 0.12,
      scale: 1.01
    });
  }, [selectedCategory, selectedSubcategory, priceRange, searchText, sortOption, products]);

  // Subcategories mapping
  const subcategories = useMemo(() => {
    switch (selectedCategory) {
      case 'vestuario':
        return ['todos', 'Blusas', 'Calças', 'Saias', 'Moletons', 'Camisas', 'Vestidos', 'Conjuntos', 'Outros'];
      case 'calcados':
        return ['todos', 'Sapatos', 'Sandálias', 'Chinelos', 'Tênis', 'Outros'];
      case 'sorvete':
        return ['todos', '250ml', '500ml', '700ml'];
      default:
        return ['todos'];
    }
  }, [selectedCategory]);

  // Reset subcategory on main category change
  const handleCategoryChange = (cat: 'todos' | 'vestuario' | 'calcados' | 'sorvete') => {
    onCategorySelect(cat);
    setSelectedSubcategory('todos');
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Main Category Filter
        if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
          return false;
        }
        // Subcategory Filter
        if (selectedSubcategory !== 'todos' && product.subcategory !== selectedSubcategory) {
          return false;
        }
        // Price Range Filter
        if (product.price > priceRange) {
          return false;
        }
        // Search query filter (matches name, category, subcategory, price, or description)
        if (searchText) {
          const query = searchText.toLowerCase();
          return (
            product.name.toLowerCase().includes(query) ||
            product.subcategory.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0; // Default order
        }
      });
  }, [products, selectedCategory, selectedSubcategory, priceRange, searchText, sortOption]);

  const handleShare = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?prod=${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Olha que produto fantástico no catálogo do Cantinho da Bianca!`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link do produto copiado para a área de transferência!');
    }
  };

  const getWhatsAppLink = (product: Product) => {
    const message = `Olá, tenho interesse no produto *${product.name}* do catálogo.
Categoria: ${product.category.toUpperCase()} (${product.subcategory})
Preço: ${product.price} MT
Status: ${product.status === 'disponivel' ? 'Disponível' : 'Esgotado'}`;
    return `https://wa.me/258866473065?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="catalogo" className="py-20 bg-[#0F172A] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Montra Digital</span>
            <h2 className="font-serif font-light italic text-3xl sm:text-4xl mt-2 text-white">
              Nossos <span className="font-sans font-black not-italic tracking-tighter uppercase">Produtos</span>
            </h2>
            <p className="text-slate-400 font-light text-sm mt-2">
              Explore o nosso catálogo e encomende via WhatsApp com um só clique.
            </p>
          </div>

          {/* Quick Category Tab Selection */}
          <div className="flex flex-wrap gap-2">
            {(['todos', 'vestuario', 'calcados', 'sorvete'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat === 'todos' ? 'Todos' : cat === 'vestuario' ? 'Vestuário' : cat === 'calcados' ? 'Calçados' : 'Yougurt'}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
          {/* Left panel: Filters (Pills and Price Range) */}
          <div className="lg:col-span-3 space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <SlidersHorizontal size={16} className="text-blue-500" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Filtros Dinâmicos</h3>
            </div>

            {/* Subcategory selection (if relevant) */}
            {subcategories.length > 1 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Subcategoria</h4>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all w-full cursor-pointer ${
                        selectedSubcategory === sub
                          ? 'bg-blue-600/10 text-blue-400 font-semibold border-l-2 border-blue-500 pl-3'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {sub === 'todos' ? 'Todas' : sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Preço Máximo</h4>
                <span className="text-xs font-bold text-blue-400 font-mono">{priceRange} MT</span>
              </div>
              <input
                type="range"
                min="100"
                max="6000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>100 MT</span>
                <span>6000 MT</span>
              </div>
            </div>

            {/* Active filters summary */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedSubcategory('todos');
                  setPriceRange(6000);
                  setSortOption('default');
                }}
                className="text-[10px] text-slate-500 hover:text-white transition-colors underline cursor-pointer"
              >
                Limpar todos os filtros
              </button>
            </div>
          </div>

          {/* Right panel: Product list, sorting bar, and list header */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between bg-slate-900/30 px-4 py-3 rounded-xl border border-slate-900">
              <span className="text-xs text-slate-400">
                A mostrar <strong className="text-white">{filteredProducts.length}</strong> produtos
              </span>

              {/* Sorting Select */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden sm:inline">Ordenar por</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="default">Destaque</option>
                  <option value="price-asc">Preço: Menor para Maior</option>
                  <option value="price-desc">Preço: Maior para Menor</option>
                  <option value="name-asc">Nome: A - Z</option>
                  <option value="newest">Mais Recentes</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      onClick={() => onProductClick(product)}
                      className="catalogue-tilt group flex flex-col h-full rounded-2xl glass-card overflow-hidden shadow-md hover:shadow-xl hover:border-slate-800 hover:-translate-y-1.5 transition-all duration-300 relative cursor-pointer"
                    >
                      {/* Product Image & Badges */}
                      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                        <img
                          src={product.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Shimmer overlay for smooth rendering */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          {product.status === 'esgotado' ? (
                            <span className="bg-red-600 text-white font-display font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">
                              Esgotado
                            </span>
                          ) : (
                            <>
                              {product.news && (
                                <span className="bg-blue-600 text-white font-display font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">
                                  Novo
                                </span>
                              )}
                              {product.bestseller && (
                                <span className="bg-amber-500 text-slate-950 font-display font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">
                                  Mais Vendido
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Subcategory Badge */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className="bg-slate-950/80 border border-slate-800 text-[9px] text-slate-300 font-medium px-2 py-0.5 rounded">
                            {product.subcategory}
                          </span>
                        </div>

                        {/* Share & Favorite Buttons overlay on image hover */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <button
                            onClick={(e) => handleShare(e, product)}
                            title="Partilhar Produto"
                            className="p-2 rounded-full bg-slate-950/90 text-slate-300 hover:text-blue-400 border border-slate-800 shadow-md hover:scale-105 transition-all cursor-pointer"
                          >
                            <Share2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-4 flex flex-col flex-grow justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                            {product.category === 'vestuario' ? 'Vestuário' : product.category === 'calcados' ? 'Calçados' : 'Yougurt de Malambe'}
                          </span>
                          <h3 className="font-display font-bold text-sm text-slate-100 group-hover:text-blue-400 mt-1 line-clamp-1 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-light mt-1.5 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Price and actions */}
                        <div className="pt-4 mt-4 border-t border-slate-900/80 flex items-center justify-between">
                          <div className="flex flex-col">
                            {product.originalPrice && (
                              <span className="text-[10px] text-slate-500 line-through">
                                {product.originalPrice} MT
                              </span>
                            )}
                            <span className="font-display font-bold text-base text-amber-400 font-mono">
                              {product.price} MT
                            </span>
                          </div>

                          {/* Quick checkout CTA buttons */}
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onProductClick(product);
                              }}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:text-white transition-all cursor-pointer"
                              title="Ver detalhes"
                            >
                              <Info size={14} />
                            </button>
                            <a
                              href={getWhatsAppLink(product)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                                product.status === 'esgotado'
                                  ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800/40 pointer-events-none'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/10'
                              }`}
                            >
                              <MessageSquare size={13} className="fill-white" />
                              <span>Pedir</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center rounded-2xl glass-card border border-slate-900 max-w-md mx-auto space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-slate-950 text-slate-500 border border-slate-900">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-200">Nenhum produto encontrado</h3>
                  <p className="text-xs text-slate-400 px-6 font-light">
                    Não conseguimos encontrar nenhum produto com os filtros ativos. Tente limpar os filtros ou alterar a sua pesquisa!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSubcategory('todos');
                      setPriceRange(6000);
                      onCategorySelect('todos');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer"
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
