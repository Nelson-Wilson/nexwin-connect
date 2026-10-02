import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useStore } from '../context/StoreContext';

export default function StoreBanners() {
  const { banners, accent } = useStore();
  const active = banners.filter((b) => b.active);
  if (active.length === 0) return null;

  return (
    <section className="bg-[#f3f7ff] pb-4 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect={active.length > 1 ? 'fade' : undefined}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={active.length > 1 ? { clickable: true } : false}
          className="overflow-hidden rounded-[30px] border border-slate-200 bg-[#061b39] shadow-[0_20px_50px_rgba(6,27,57,0.18)]"
        >
          {active.map((banner) => {
            const content = (
              <div className="relative aspect-[21/8] w-full overflow-hidden bg-[#061b39]">
                {banner.image && <img src={banner.image} alt={banner.title} className="h-full w-full object-cover opacity-90" referrerPolicy="no-referrer" />}
                <div className="absolute inset-0 bg-gradient-to-r from-[#061b39]/90 via-[#061b39]/60 to-[#061b39]/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),transparent_26%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:left-8 sm:bottom-8 sm:right-8 sm:p-0">
                  <div className="max-w-xl rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">Oferta especial</p>
                    <h3 className="mt-2 text-xl font-extrabold tracking-[-0.04em] text-white sm:text-3xl">{banner.title}</h3>
                    {banner.subtitle && <p className="mt-2 text-sm text-slate-200">{banner.subtitle}</p>}
                  </div>
                </div>
                <div className="absolute right-6 top-6 hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white sm:flex" style={{ boxShadow: `0 0 25px ${accent}55` }}>%</div>
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
