import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useStore } from '../context/StoreContext';

export default function StoreBanners() {
  const { banners } = useStore();
  const active = banners.filter((b) => b.active);
  if (active.length === 0) return null;

  return (
    <section className="bg-[#0F172A] pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect={active.length > 1 ? 'fade' : undefined}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={active.length > 1 ? { clickable: true } : false}
          className="rounded-3xl overflow-hidden border border-white/10"
        >
          {active.map((banner) => {
            const content = (
              <div className="relative aspect-[21/9] sm:aspect-[3/1] w-full bg-slate-950">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-display font-bold text-lg sm:text-2xl text-white">{banner.title}</h3>
                  {banner.subtitle && <p className="text-sm text-slate-300 mt-1">{banner.subtitle}</p>}
                </div>
              </div>
            );
            return (
              <SwiperSlide key={banner.id}>
                {banner.link ? (
                  <a href={banner.link} target="_blank" rel="noreferrer">{content}</a>
                ) : (
                  content
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
