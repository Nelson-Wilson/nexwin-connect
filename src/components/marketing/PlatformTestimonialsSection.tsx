import { useRef } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

const TESTIMONIALS = [
  {
    name: 'Bianca Nhaca',
    role: 'Cantinho da Bianca · Moda',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    quote:
      'Em menos de uma semana comecei a receber encomendas pelo WhatsApp. Nunca pensei que fosse tão simples ter a minha própria loja online.',
  },
  {
    name: 'Suraia Cassamo',
    role: 'Gelados Malambe · Sorveteria',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    quote:
      'O painel é muito fácil de usar. Consigo adicionar novos sabores e promoções sozinha, sem depender de ninguém.',
  },
  {
    name: 'Wilson Mondlane',
    role: 'WWD Serenetas · Moda',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    quote:
      'A loja ficou com a nossa cara — as cores, o logótipo, tudo. Os clientes elogiam sempre o visual profissional.',
  },
];

export default function PlatformTestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useTilt(containerRef);

  return (
    <section className="py-20 sm:py-28 bg-[#0F172A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Quem já usa</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            O que dizem os <span className="font-sans font-black not-italic tracking-tighter uppercase">nossos empreendedores</span>
          </h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 perspective-1000">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="tilt-card glass-card rounded-2xl p-6 flex flex-col"
            >
              <Quote className="w-6 h-6 text-blue-500/50 mb-4" />
              <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <p className="text-white text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
