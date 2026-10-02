import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import SectionIntro from './SectionIntro';

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
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="Quem já usa" title="O que dizem os nossos empreendedores" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="ui-card ui-card-hover rounded-2xl p-6 sm:p-7 flex flex-col"
            >
              <div className="flex gap-0.5" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-slate-600 text-sm leading-relaxed flex-1 mt-4">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
                />
                <div>
                  <p className="text-slate-900 text-sm font-bold">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">{testimonial.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
