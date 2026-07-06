import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, CheckCircle2, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden bg-[#0F172A]">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5">
              Feito para Moçambique
            </span>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] mt-6 tracking-tight">
              Crie a sua loja online<br />
              em <span className="text-gradient-blue">minutos.</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg mt-6 max-w-lg leading-relaxed">
              Venda pelo WhatsApp, personalize a sua loja e faça o seu negócio
              crescer sem precisar de saber programar. A NexWin Connect dá-lhe
              tudo o que precisa para vender online, hoje.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-9">
              <Link
                to="/registar"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-7 py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
              >
                Criar Loja Grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#exemplos"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-bold text-slate-200 border border-white/10 hover:border-white/25 hover:bg-white/5 px-7 py-4 rounded-xl transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                Ver Demonstração
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10">
              {['7 dias grátis', 'Sem cartão de crédito', 'Pronto em 5 minutos'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — device mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[420px] sm:h-[480px] lg:h-[520px]"
          >
            {/* Desktop / browser window */}
            <div className="absolute top-0 left-0 w-[92%] sm:w-[85%] rounded-xl glass-card shadow-2xl shadow-black/40 overflow-hidden animate-float-medium">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-[10px] text-slate-500 font-mono">nexwinconnect.com/loja/bianca-moda</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-3 w-24 rounded bg-gradient-to-r from-blue-400 to-blue-600" />
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/10" />
                    <div className="h-6 w-6 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2, 3, 5, 4].map((i) => (
                    <div key={i} className="rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 aspect-square flex items-end p-2">
                      <div className="h-2 w-3/4 rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone / WhatsApp mockup */}
            <div className="absolute bottom-0 right-0 w-[52%] sm:w-[46%] rounded-[1.75rem] glass-card shadow-2xl shadow-black/50 overflow-hidden border-2 border-white/10 animate-float-fast">
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-600/90">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                  CB
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-none">Cantinho da Bianca</p>
                  <p className="text-[9px] text-emerald-100 mt-0.5">online agora</p>
                </div>
              </div>
              <div className="p-3 space-y-2 bg-slate-900/70 min-h-[180px]">
                <div className="bg-white/10 rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                  <p className="text-[10px] text-slate-200">Olá! Tem o vestido azul em stock? 👗</p>
                </div>
                <div className="bg-blue-600 rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%] ml-auto">
                  <p className="text-[10px] text-white">Sim! Tamanho M e L disponíveis ✅</p>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-slate-400 ml-1">147 vendas</span>
                </div>
              </div>
            </div>

            {/* Floating stat chip */}
            <div className="absolute top-6 -right-2 sm:right-4 glass-card rounded-xl px-4 py-3 shadow-xl animate-float-slow">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Encomendas hoje</p>
              <p className="text-xl font-display font-bold text-white mt-0.5">+23</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
