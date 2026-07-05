import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="depoimentos" className="py-20 bg-[#0F172A] text-white relative border-t border-white/5">
      {/* Background ambient light */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Avaliações reais</span>
          <h2 className="font-serif font-light italic text-3xl text-white mt-2">
            O que dizem os <span className="font-sans font-black not-italic tracking-tighter uppercase">nossos clientes</span>
          </h2>
        </div>

        {/* Testimonials Slider */}
        <div className="relative min-h-[250px] flex items-center justify-center p-6 sm:p-10 rounded-3xl glass-card border border-slate-900">
          
          <div className="absolute top-6 left-6 text-blue-500/10 pointer-events-none">
            <Quote size={80} className="transform -scale-x-100" />
          </div>

          <AnimatePresence mode="wait">
            {testimonials.map((test, idx) => {
              if (idx !== currentIndex) return null;
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full text-center space-y-6 relative z-10"
                >
                  {/* Stars Rating */}
                  <div className="flex items-center justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < test.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl mx-auto italic">
                    "{test.comment}"
                  </p>

                  {/* Author metadata */}
                  <div className="flex flex-col items-center gap-2 pt-2">
                    {test.photo && (
                      <img
                        src={test.photo}
                        alt={test.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/25"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">{test.name}</h4>
                      {test.role && (
                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mt-0.5 block">
                          {test.role}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Depoimento Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Próximo Depoimento"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
