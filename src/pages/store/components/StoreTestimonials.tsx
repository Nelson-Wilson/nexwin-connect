import { Star, Quote } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function StoreTestimonials() {
  const { testimonials, accent } = useStore();
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-[#0b1425] border-y border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>O que dizem</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-2 tracking-tight">Clientes Satisfeitos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="glass-card rounded-2xl p-5 relative">
              <Quote size={22} className="absolute top-4 right-4 opacity-10" style={{ color: accent }} />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
                  {t.photo && <img src={t.photo} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  {t.role && <p className="text-xs text-slate-500 truncate">{t.role}</p>}
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{t.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
