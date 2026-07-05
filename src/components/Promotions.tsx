import { useState, useEffect } from 'react';
import { Tag, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { Promotion, Product } from '../types';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface PromotionsProps {
  promotions: Promotion[];
  products: Product[];
  onProductClick: (p: Product) => void;
}

export default function Promotions({ promotions, products, onProductClick }: PromotionsProps) {
  // Retrieve products in promotion or bestsellers to showcase
  const deals = products.filter(p => p.originalPrice && p.status === 'disponivel').slice(0, 3);

  const handlePromoClick = (p: Promotion) => {
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="promocoes" className="py-20 bg-[#0F172A] relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: Active Campaign Slider */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Flame size={16} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Campanhas Ativas</span>
            </div>
            
            <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white">
              Ofertas <span className="font-sans font-black not-italic tracking-tighter uppercase">Imperdíveis</span>
            </h2>

            {/* Campaign Slider Box using Swiper.js */}
            <div className="relative h-[320px] sm:h-[350px] rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800">
              {promotions.length > 0 ? (
                <Swiper
                  modules={[Autoplay, Pagination, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  pagination={{ clickable: true, bulletActiveClass: 'swiper-pagination-bullet-active bg-amber-500' }}
                  loop={promotions.length > 1}
                  className="w-full h-full"
                >
                  {promotions.map((promo) => (
                    <SwiperSlide key={promo.id} className="relative w-full h-full flex items-end">
                      {/* Promo Image */}
                      <img
                        src={promo.bannerImage}
                        alt={promo.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient mask */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 space-y-3">
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          <Tag size={10} />
                          {promo.discount}
                        </span>
                        
                        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                          {promo.title}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-lg">
                          {promo.description}
                        </p>

                        <button
                          onClick={() => handlePromoClick(promo)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-2 cursor-pointer"
                        >
                          <span>Ver Produtos Promocionais</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-center text-slate-500 text-xs">
                  Nenhuma campanha ativa no momento.
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Active Discounted Items Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-300">Destaques com Desconto</h3>
            </div>

            <div className="space-y-4">
              {deals.length > 0 ? (
                deals.map((p) => {
                  const discountPct = p.originalPrice 
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
                    : 0;
                  
                  return (
                    <div
                      key={p.id}
                      onClick={() => onProductClick(p)}
                      className="group flex gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700/80 transition-all cursor-pointer"
                    >
                      {/* Photo */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {discountPct > 0 && (
                          <div className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            -{discountPct}%
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col justify-between flex-grow overflow-hidden">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{p.subcategory}</span>
                          <h4 className="font-semibold text-sm text-slate-100 group-hover:text-blue-400 transition-colors truncate mt-0.5">
                            {p.name}
                          </h4>
                        </div>
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="font-mono text-sm font-bold text-amber-400">{p.price} MT</span>
                          {p.originalPrice && (
                            <span className="font-mono text-xs text-slate-500 line-through">{p.originalPrice} MT</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center rounded-2xl bg-slate-900/20 border border-slate-900/60 text-slate-500 text-xs font-light">
                  Sem produtos em destaque no momento. Veja todo o catálogo!
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
