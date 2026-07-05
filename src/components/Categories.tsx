import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shirt, Footprints, Milk } from 'lucide-react';
import VanillaTilt from 'vanilla-tilt';

interface CategoriesProps {
  onCategorySelect: (category: 'vestuario' | 'calcados' | 'sorvete') => void;
}

export default function Categories({ onCategorySelect }: CategoriesProps) {
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card');
    VanillaTilt.init(Array.from(cards) as HTMLElement[], {
      max: 12,
      speed: 300,
      glare: true,
      'max-glare': 0.15,
      scale: 1.02
    });
  }, []);

  const categoriesList = [
    {
      id: 'vestuario' as const,
      name: 'Vestuário Premium',
      description: 'Camisas, blusas, conjuntos, calças, vestidos e mais com tecidos requintados.',
      icon: Shirt,
      color: 'from-blue-600/20 to-blue-900/40 border-blue-500/20',
      badgeColor: 'bg-blue-600 text-white',
      bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
      stats: '8 Subcategorias'
    },
    {
      id: 'calcados' as const,
      name: 'Calçados Sofisticados',
      description: 'Tênis esportivos, sapatos casuais, sandálias e chinelos de alta durabilidade.',
      icon: Footprints,
      color: 'from-purple-600/20 to-purple-900/40 border-purple-500/20',
      badgeColor: 'bg-purple-600 text-white',
      bgImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
      stats: '5 Subcategorias'
    },
    {
      id: 'sorvete' as const,
      name: 'Yougurt de Malambe',
      description: 'O sabor sagrado e nutritivo da savana moçambicana em potes de 250ml, 500ml e 700ml.',
      icon: Milk,
      color: 'from-amber-600/20 to-amber-900/40 border-amber-500/20',
      badgeColor: 'bg-amber-500 text-slate-950',
      bgImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
      stats: '3 Tamanhos'
    }
  ];

  const handleCategoryClick = (categoryId: 'vestuario' | 'calcados' | 'sorvete') => {
    onCategorySelect(categoryId);
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categorias" className="py-20 bg-[#0F172A] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Navegue pelas Secções</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Nossas <span className="font-sans font-black not-italic tracking-tighter uppercase">Categorias</span>
          </h2>
          <p className="text-slate-400 font-light mt-3 text-sm sm:text-base">
            Selecione uma categoria abaixo para filtrar instantaneamente o nosso catálogo e encontrar o produto perfeito.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
          {categoriesList.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="tilt-card group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800/80 preserve-3d transition-all duration-500 hover:-translate-y-2 hover:border-slate-700/80 shadow-xl hover:shadow-2xl"
              >
                {/* Background image overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.bgImage}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-35 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                </div>

                {/* Content Box */}
                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">
                  {/* Top Bar with Icon */}
                  <div className="flex justify-between items-start">
                    <div className={`p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <IconComponent size={24} className={cat.id === 'sorvete' ? 'text-amber-400' : 'text-blue-400'} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${cat.badgeColor}`}>
                      {cat.stats}
                    </span>
                  </div>

                  {/* Bottom Text Description */}
                  <div className="space-y-3 transform translate-z-20">
                    <h3 className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-white">
                      <span>Ver Catálogo</span>
                      <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
