import { motion } from 'motion/react';
import { ArrowUpRight, MessageCircle, TrendingUp, Package, Eye, ShoppingBag, Star } from 'lucide-react';
import SectionIntro from './SectionIntro';

const DEMO_STORE_URL = 'https://nexwin-connect.vercel.app/loja/nextwin';

const CHART = [22, 34, 28, 46, 40, 58, 52, 70, 62, 84];
const ORDERS = [
  ['Vestido azul M', 'Maria J.', '1.250 MT', 'bg-emerald-50 text-emerald-600', 'Concluído'],
  ['Conjunto verão', 'Carlos M.', '2.400 MT', 'bg-amber-50 text-amber-600', 'Pendente'],
  ['Sandálias couro', 'Ana S.', '890 MT', 'bg-emerald-50 text-emerald-600', 'Concluído'],
];
const TOP = [
  ['Vestido azul', 82],
  ['Conjunto verão', 64],
  ['Sandálias couro', 47],
] as const;

function polyline(values: number[], w: number, h: number) {
  const step = w / (values.length - 1);
  return values.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / 100) * h).toFixed(1)}`).join(' ');
}

export default function ShowcaseSection() {
  return (
    <section id="demonstracao" className="py-20 sm:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="O painel administrativo"
          title="Controle a sua loja num só lugar"
          description="Produtos, banners, promoções e estatísticas, com uma interface limpa que qualquer pessoa consegue usar."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl ui-card overflow-hidden shadow-2xl shadow-slate-900/10"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            <span className="ml-3 text-[10px] text-slate-400 font-mono">nexwinconnect.com/painel</span>
          </div>

          <div className="p-4 sm:p-6 bg-slate-50/70">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { i: Package, l: 'Produtos', v: '48', d: '+6 este mês', t: 'bg-blue-50 text-blue-600' },
                { i: Eye, l: 'Visitas', v: '1.248', d: '+18%', t: 'bg-violet-50 text-violet-600' },
                { i: ShoppingBag, l: 'Pedidos', v: '23', d: '+9%', t: 'bg-emerald-50 text-emerald-600' },
                { i: Star, l: 'Em destaque', v: '8', d: 'activos', t: 'bg-amber-50 text-amber-600' },
              ].map((s) => (
                <div key={s.l} className="bg-white border border-slate-100 rounded-2xl p-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.t}`}>
                    <s.i className="w-4 h-4" />
                  </span>
                  <p className="text-xs text-slate-500 mt-3">{s.l}</p>
                  <p className="text-2xl font-extrabold text-slate-900 leading-tight">{s.v}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {s.d}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-slate-900">Visitas por dia</p>
                  <span className="text-[11px] text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">Últimos 10 dias</span>
                </div>
                <svg viewBox="0 0 400 130" className="w-full h-36" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#2563eb" stopOpacity="0.22" />
                      <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1="0" x2="400" y1={i * 40 + 5} y2={i * 40 + 5} stroke="#e2e8f0" strokeDasharray="3 4" />
                  ))}
                  <polygon points={`0,130 ${polyline(CHART, 400, 120)} 400,130`} fill="url(#area)" />
                  <motion.polyline
                    points={polyline(CHART, 400, 120)}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                  />
                </svg>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5">
                <p className="text-sm font-bold text-slate-900 mb-4">Mais procurados</p>
                <div className="space-y-4">
                  {TOP.map(([n, v]) => (
                    <div key={n}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">{n}</span>
                        <span className="text-slate-500">{v}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${v}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 mt-3 sm:mt-4">
              <p className="text-sm font-bold text-slate-900 mb-3">Pedidos recentes</p>
              <div className="divide-y divide-slate-100">
                {ORDERS.map(([p, c, v, tone, s]) => (
                  <div key={p} className="flex items-center justify-between gap-3 py-2.5 text-xs">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{p}</p>
                      <p className="text-slate-500">{c}</p>
                    </div>
                    <span className="font-bold text-slate-900 hidden sm:block">{v}</span>
                    <span className={`rounded-full px-2.5 py-1 font-semibold ${tone}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-center text-[11px] text-slate-400 mt-4">Imagem ilustrativa do painel.</p>

        {/* Real demo store */}
        <motion.a
          href={DEMO_STORE_URL}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="group mt-10 ui-card ui-card-hover rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 max-w-3xl mx-auto"
        >
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-display font-extrabold text-white text-lg shrink-0 shadow-lg shadow-blue-600/25">
            NX
          </span>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-slate-900">Explore uma loja real</h3>
            <p className="text-slate-500 text-sm mt-1">
              Veja o catálogo e o botão de encomenda pelo WhatsApp, exactamente como os seus clientes vão ver.
            </p>
            <p className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mt-2">
              <MessageCircle className="w-3.5 h-3.5" />
              Encomendas via WhatsApp activas
            </p>
          </div>
          <span className="w-11 h-11 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors shrink-0">
            <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
