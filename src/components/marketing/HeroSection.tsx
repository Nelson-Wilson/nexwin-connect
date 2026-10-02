import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  ShoppingBag,
  PackageCheck,
  Eye,
  BadgeCheck,
  LayoutDashboard,
  Package,
  FolderTree,
  Palette,
  Search,
  MessageCircle,
} from 'lucide-react';

const BARS = [38, 55, 44, 70, 52, 82, 64];
const PRODUCTS = [
  'from-rose-100 to-rose-50',
  'from-sky-100 to-sky-50',
  'from-amber-100 to-amber-50',
  'from-emerald-100 to-emerald-50',
];

/** Floating notification chip. Amplitude is deliberately tiny so the motion stays discreet. */
function FloatChip({
  icon: Icon,
  tone,
  title,
  sub,
  className,
  delay,
}: {
  icon: typeof ShoppingBag;
  tone: string;
  title: string;
  sub: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 + delay }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        className="ui-card rounded-2xl pl-2.5 pr-4 py-2.5 flex items-center gap-2.5"
      >
        <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${tone}`}>
          <Icon className="w-4 h-4" />
        </span>
        <span className="leading-tight">
          <span className="block text-xs font-bold text-slate-900">{title}</span>
          <span className="block text-[11px] text-slate-500">{sub}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-white via-blue-50/60 to-slate-50">
      <div className="hidden sm:block absolute -top-32 -right-24 w-[560px] h-[560px] rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute top-40 -left-32 w-[420px] h-[420px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-white border border-blue-100 rounded-full pl-2 pr-4 py-1.5 shadow-sm">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <BadgeCheck className="w-3 h-3" />
              </span>
              Feito para Moçambique
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.4rem] text-slate-900 leading-[1.08] mt-6 tracking-tight">
              Crie sua loja online em <span className="text-gradient-brand">poucos minutos.</span>
            </h1>

            <p className="text-slate-500 text-base sm:text-lg mt-6 max-w-lg leading-relaxed">
              Cadastre produtos, organize categorias, personalize sua loja e receba pedidos diretamente pelo WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-9">
              <Link
                to="/registar"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-7 py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
              >
                Criar minha loja
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demonstracao"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-7 py-4 rounded-xl transition-all"
              >
                <PlayCircle className="w-4 h-4 text-blue-600" />
                Ver demonstração
              </a>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8">
              {['7 dias grátis', 'Sem cartão de crédito', 'Pronto em 5 minutos'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-500 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product mockup: dashboard on desktop + store open on a phone */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] sm:h-[480px] lg:h-[520px]"
            aria-hidden="true"
          >
            <div className="absolute top-6 left-0 w-[94%] sm:w-[88%] rounded-2xl ui-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 text-[10px] text-slate-400 font-mono truncate">nexwinconnect.com/painel</span>
              </div>
              <div className="flex">
                <div className="hidden sm:flex flex-col gap-1 w-32 p-3 border-r border-slate-100 bg-white">
                  {[
                    { i: LayoutDashboard, l: 'Dashboard', a: true },
                    { i: Package, l: 'Produtos' },
                    { i: FolderTree, l: 'Categorias' },
                    { i: Palette, l: 'Personalização' },
                  ].map(({ i: I, l, a }) => (
                    <span
                      key={l}
                      className={`flex items-center gap-2 text-[10px] font-semibold rounded-lg px-2 py-1.5 ${
                        a ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      <I className="w-3 h-3" />
                      {l}
                    </span>
                  ))}
                </div>
                <div className="flex-1 p-4 bg-slate-50/60">
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      ['Produtos', '48'],
                      ['Visitas', '1,2 mil'],
                      ['Pedidos', '23'],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-white border border-slate-100 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-400 font-medium">{l}</p>
                        <p className="text-sm font-extrabold text-slate-900 mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-slate-100 rounded-xl p-3 mt-2.5">
                    <p className="text-[9px] text-slate-400 font-medium mb-2">Visitas da semana</p>
                    <div className="flex items-end gap-2 h-16">
                      {BARS.map((h, i) => (
                        <motion.span
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.7, delay: 0.5 + i * 0.05 }}
                          className={`flex-1 rounded-t-md ${i === 5 ? 'bg-blue-600' : 'bg-blue-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 sm:right-2 w-[44%] sm:w-[36%] rounded-[1.75rem] bg-white border-[5px] border-slate-900 shadow-2xl shadow-slate-900/20 overflow-hidden">
              <div className="px-3 pt-3 pb-2 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-900">Cantinho da Bianca</span>
                  <Search className="w-3 h-3 text-slate-400" />
                </div>
                <div className="mt-2 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600" />
              </div>
              <div className="grid grid-cols-2 gap-2 px-3 pb-2">
                {PRODUCTS.map((g, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 p-1.5">
                    <div className={`aspect-square rounded-md bg-gradient-to-br ${g}`} />
                    <div className="h-1.5 w-4/5 rounded-full bg-slate-200 mt-1.5" />
                    <div className="h-1.5 w-2/5 rounded-full bg-emerald-300 mt-1" />
                  </div>
                ))}
              </div>
              <div className="mx-3 mb-3 rounded-lg bg-emerald-500 text-white text-[9px] font-bold py-1.5 flex items-center justify-center gap-1">
                <MessageCircle className="w-3 h-3" />
                Pedir no WhatsApp
              </div>
            </div>

            <FloatChip icon={ShoppingBag} tone="bg-blue-50 text-blue-600" title="Novo pedido" sub="agora mesmo" className="top-0 right-2 sm:right-10" delay={0} />
            <FloatChip icon={PackageCheck} tone="bg-violet-50 text-violet-600" title="Produto publicado" sub="Vestido azul" className="hidden sm:block top-[44%] -left-1 sm:-left-6" delay={0.6} />
            <FloatChip icon={Eye} tone="bg-sky-50 text-sky-600" title="235 visitantes" sub="hoje" className="hidden sm:block bottom-24 left-6 sm:left-14" delay={1.2} />
            <FloatChip icon={BadgeCheck} tone="bg-emerald-50 text-emerald-600" title="Venda concluída" sub="1.250 MT" className="bottom-2 left-[30%] sm:left-[34%]" delay={1.8} />
          </motion.div>
        </div>
        <p className="text-center lg:text-right text-[11px] text-slate-400 mt-6">Imagem ilustrativa do sistema.</p>
      </div>
    </section>
  );
}
