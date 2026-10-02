import { Flame, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useStore } from '../context/StoreContext';

export default function StorePromotions() {
  const { promotions, accent } = useStore();
  const active = promotions.filter((p) => p.active);

  if (active.length === 0) return null;

  const scrollToCatalogue = () => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="promocoes" className="py-16 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="flex items-center justify-center p-2 rounded-lg bg-amber-500/10 text-amber-600">
            <Flame size={16} />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Campanhas Ativas</span>
            <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">Ofertas Imperdíveis</h2>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="pb-10"
        >
          {active.map((promo) => (
            <SwiperSlide key={promo.id}>
              <button
                onClick={scrollToCatalogue}
                className="w-full text-left rounded-2xl overflow-hidden ui-card group hover:-translate-y-1 transition-all"
              >
                <div
                  className="aspect-video bg-slate-100 overflow-hidden flex items-center justify-center"
                  style={promo.bannerImage ? undefined : { background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}
                >
                  {promo.bannerImage ? (
                    <img src={promo.bannerImage} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="font-display font-extrabold text-5xl text-white/90">{promo.discount}</span>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: `${accent}22`, color: accent }}>
                    {promo.discount}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 mt-3">{promo.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{promo.description}</p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mt-3">
                    Ver catálogo <ArrowRight size={12} />
                  </div>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
