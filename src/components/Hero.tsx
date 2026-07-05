import { motion } from 'motion/react';
import { ShoppingBag, MessageSquare, Sparkles, ChevronDown } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  const whatsappUrl = "https://wa.me/258866473065?text=Ol%C3%A1!%20Vim%20do%20cat%C3%A1logo%20e%20gostaria%20de%20fazer%20uma%20encomenda.";

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A] pt-20">
      {/* Dynamic Background Light Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-600/10 blur-[100px] sm:blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] rounded-full bg-amber-500/10 blur-[100px] sm:blur-[130px]" />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mx-auto lg:mx-0"
            >
              <Sparkles size={11} className="text-amber-400" />
              Sabor & Estilo Exclusivo
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight text-white"
            >
              Catálogo Premium <span className="font-sans font-black not-italic block text-gradient-primary tracking-tighter uppercase text-3xl sm:text-4xl md:text-5xl mt-2">Moda & Yougurt</span>
              <span className="block text-amber-400 font-bold font-serif not-italic tracking-normal mt-1 text-2xl sm:text-3xl md:text-4xl">de Malambe</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
            >
              Descubra a combinação perfeita entre o vestuário elegante, calçados sofisticados e o autêntico, cremoso e super nutritivo Yougurt artesanal de Malambe. Peça já pelo WhatsApp!
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
              >
                <ShoppingBag size={18} />
                Explorar Catálogo
              </button>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold px-8 py-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
              >
                <MessageSquare size={18} className="text-emerald-500" />
                Falar no WhatsApp
              </a>
            </motion.div>

            {/* Benefits Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-900 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <span className="block font-display font-bold text-xl sm:text-2xl text-white">100%</span>
                <span className="block text-xs text-slate-400 font-medium">Artesanal & Natural</span>
              </div>
              <div className="border-x border-slate-900">
                <span className="block font-display font-bold text-xl sm:text-2xl text-blue-500">Premium</span>
                <span className="block text-xs text-slate-400 font-medium">Marcas Exclusivas</span>
              </div>
              <div>
                <span className="block font-display font-bold text-xl sm:text-2xl text-emerald-400">Rápido</span>
                <span className="block text-xs text-slate-400 font-medium">Entrega e Suporte</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full max-w-[400px] h-[400px] sm:h-[450px] flex items-center justify-center"
            >
              {/* Spinning background halo */}
              <div className="absolute w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] rounded-full border border-dashed border-blue-500/30 animate-[spin_40s_linear_infinite]" />
              <div className="absolute w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] rounded-full border border-blue-500/10" />

              {/* Central Floating Card - Composite Fashion & Dessert Mockup */}
              <div className="absolute z-10 w-[240px] h-[340px] rounded-3xl glass-card p-4 flex flex-col justify-between shadow-2xl border border-slate-800/80 animate-float-slow transform -rotate-3 hover:rotate-0 transition-transform duration-500 group">
                <div className="relative h-[200px] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1501443715940-a10640d59081?w=800&auto=format&fit=crop&q=80"
                    alt="Yougurt de Malambe Premium"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-display font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Sabor Sagrado
                  </div>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Destaque Exótico</span>
                  <h4 className="font-display font-bold text-sm text-white mt-1">Yougurt Gourmet de Malambe</h4>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900">
                    <span className="font-mono text-xs font-semibold text-slate-300">Pote 500ml</span>
                    <span className="font-display font-bold text-sm text-amber-400">280 MT</span>
                  </div>
                </div>
              </div>

              {/* Overlapping secondary floating card - Fashion */}
              <div className="absolute z-20 w-[180px] h-[240px] rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-col justify-between shadow-2xl -right-2 top-8 animate-float-medium transform rotate-6 hover:rotate-0 transition-transform duration-500 group">
                <div className="relative h-[130px] rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80"
                    alt="Moda Premium"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white font-display font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Zara Style
                  </div>
                </div>
                <div>
                  <h5 className="font-display font-semibold text-xs text-slate-200 mt-2 truncate">Vestuário Alfaiataria</h5>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400">Coleção Nova</span>
                    <span className="font-display font-bold text-xs text-blue-400">2500 MT</span>
                  </div>
                </div>
              </div>

              {/* Small Footwear badge */}
              <div className="absolute z-30 bottom-12 -left-6 rounded-2xl glass-card p-3 border border-slate-800 flex items-center gap-3 shadow-xl animate-float-fast transform -rotate-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop"
                    alt="Shoes"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Calçado Premium</span>
                  <span className="block font-display font-bold text-xs text-white">Nike Air Max</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Down arrow link indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={onExploreClick}>
        <span className="text-[10px] tracking-widest uppercase text-slate-500 font-medium">Ver Catálogo</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-slate-400 hover:text-white"
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
}
