import { motion } from 'motion/react';
import { Milk, Sparkles, MessageSquare, ShieldCheck, Heart, Leaf, Info } from 'lucide-react';
import { Product } from '../types';

interface MalambeSectionProps {
  products: Product[];
  onProductClick: (p: Product) => void;
}

export default function MalambeSection({ products, onProductClick }: MalambeSectionProps) {
  // Filter for sorvete products
  const sorveteProducts = products.filter(p => p.category === 'sorvete');

  // Find exact sizes
  const size250 = sorveteProducts.find(p => p.subcategory === '250ml');
  const size500 = sorveteProducts.find(p => p.subcategory === '500ml');
  const size700 = sorveteProducts.find(p => p.subcategory === '700ml');

  const getWhatsAppLink = (productName: string, price: string) => {
    const text = `Olá, vim pelo catálogo e gostaria de encomendar o *Yougurt de Malambe (${productName})* no valor de ${price}.`;
    return `https://wa.me/258866473065?text=${encodeURIComponent(text)}`;
  };

  const benefitsList = [
    {
      title: 'Antioxidante Natural',
      desc: 'Altíssimo teor de antioxidantes que protegem as células e melhoram a saúde celular.',
      icon: Leaf,
    },
    {
      title: 'Rico em Vitamina C',
      desc: 'Contém 6x mais Vitamina C do que uma laranja média, fortalecendo a imunidade.',
      icon: Sparkles,
    },
    {
      title: 'Fibras & Pré-bióticos',
      desc: 'Mais de 40% de fibras solúveis de alta absorção que auxiliam na digestão saudável.',
      icon: Heart,
    },
    {
      title: 'Cálcio & Potássio',
      desc: 'Mineralização óssea reforçada com alta concentração de cálcio biodisponível.',
      icon: ShieldCheck,
    }
  ];

  return (
    <section id="sorvete-malambe" className="py-24 bg-[#0F172A] relative overflow-hidden text-white border-t border-white/5">
      {/* Background glow specific to Malambe (warm golden amber) */}
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
         {/* Main Title Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 rounded-full uppercase tracking-[0.2em] mx-auto lg:mx-0">
              <Milk size={12} />
              Ouro de Moçambique
            </div>
            <h2 className="font-serif font-light italic text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
              Yougurt Artesanal de <span className="text-amber-400 font-sans font-black not-italic tracking-tighter uppercase">Malambe</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              O Malambe é o fruto lendário do Embondeiro (Adansonia digitata), a árvore sagrada da savana africana. Nosso yougurt é confeccionado de forma 100% artesanal, preservando a cremosidade luxuosa e o sabor cítrico perfeitamente equilibrado do fruto natural.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefitsList.map((ben, idx) => {
              const Icon = ben.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl glass-card border border-slate-900 flex gap-4 items-start">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-200">{ben.title}</h4>
                    <p className="text-[11px] text-slate-400 font-light mt-1 leading-relaxed">{ben.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento Pricing & Sizing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pote 250ml */}
          {size250 && (
            <motion.div
              whileHover={{ y: -6 }}
              className="group rounded-3xl overflow-hidden glass-card p-6 flex flex-col justify-between border border-slate-900 hover:border-amber-500/20 transition-all duration-300 h-[380px]"
            >
              <div className="space-y-4">
                <div className="relative h-[150px] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={size250.images[0] || 'https://images.unsplash.com/photo-1501443715940-a10640d59081?w=400'}
                    alt="Malambe 250ml"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-300">
                    Individual
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-100">{size250.name}</h3>
                  <p className="text-xs text-slate-400 font-light line-clamp-2 mt-1 leading-relaxed">
                    Sabor perfeito, ideal para uma degustação individual ou sobremesa rápida.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">Preço Pote</span>
                  <span className="font-display font-bold text-lg text-amber-400 font-mono">150 MT</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onProductClick(size250)}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900/80 text-slate-300"
                    title="Informações Nutricionais"
                  >
                    <Info size={14} />
                  </button>
                  <a
                    href={getWhatsAppLink('Pote 250ml', '150 MT')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
                  >
                    <MessageSquare size={13} className="fill-slate-950" />
                    Encomendar
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pote 500ml - Featured Box (Bigger/Glossier) */}
          {size500 && (
            <motion.div
              whileHover={{ y: -6 }}
              className="group rounded-3xl overflow-hidden bg-gradient-to-tr from-amber-950/20 via-slate-900/40 to-slate-900/60 p-6 flex flex-col justify-between border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 h-[400px] relative -md:top-[-10px] shadow-xl hover:shadow-amber-500/5"
            >
              {/* Highlight Ribbon */}
              <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-display font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                Mais Popular ⭐
              </div>

              <div className="space-y-4">
                <div className="relative h-[160px] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={size500.images[0] || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'}
                    alt="Malambe 500ml"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">
                    Ideal para Casal
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">{size500.name}</h3>
                  <p className="text-xs text-slate-300 font-light line-clamp-2 mt-1 leading-relaxed">
                    Perfeito para partilhar momentos especiais com amigos ou família. Excelente rendimento.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold">Preço Pote</span>
                  <span className="font-display font-bold text-xl text-amber-400 font-mono">280 MT</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onProductClick(size500)}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 text-slate-300"
                    title="Informações Nutricionais"
                  >
                    <Info size={14} />
                  </button>
                  <a
                    href={getWhatsAppLink('Pote 500ml', '280 MT')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25"
                  >
                    <MessageSquare size={13} className="fill-slate-950" />
                    Encomendar Já
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pote 700ml */}
          {size700 && (
            <motion.div
              whileHover={{ y: -6 }}
              className="group rounded-3xl overflow-hidden glass-card p-6 flex flex-col justify-between border border-slate-900 hover:border-amber-500/20 transition-all duration-300 h-[380px]"
            >
              <div className="space-y-4">
                <div className="relative h-[150px] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={size700.images[0] || 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'}
                    alt="Malambe 700ml"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-300">
                    Familiar
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-100">{size700.name}</h3>
                  <p className="text-xs text-slate-400 font-light line-clamp-2 mt-1 leading-relaxed">
                    Sabor generoso para reunir toda a família em torno da mesa no final de semana.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">Preço Pote</span>
                  <span className="font-display font-bold text-lg text-amber-400 font-mono">380 MT</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onProductClick(size700)}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900/80 text-slate-300"
                    title="Informações Nutricionais"
                  >
                    <Info size={14} />
                  </button>
                  <a
                    href={getWhatsAppLink('Pote 700ml', '380 MT')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
                  >
                    <MessageSquare size={13} className="fill-slate-950" />
                    Encomendar
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
