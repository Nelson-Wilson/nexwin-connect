import { motion } from 'motion/react';
import { ShoppingBag, MessageCircle, ChevronDown, Store as StoreIcon, Truck, ShieldCheck, Star, BadgeCheck, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const FALLBACK_MODEL_IMAGE =
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80';

export default function StoreHero({ onExploreClick }: { onExploreClick: () => void }) {
  const { business, accent, whatsappLink } = useStore();
  const wa = whatsappLink('Olá! Vim do catálogo e gostaria de fazer uma encomenda.');

  const trustItems = [
    { label: 'Entrega rápida', description: 'em todo o país', icon: Truck },
    { label: 'Pagamento seguro', description: 'dados protegidos', icon: ShieldCheck },
    { label: 'Produtos de qualidade', description: 'seleção premium', icon: Star },
    { label: 'Suporte personalizado', description: 'atendimento real', icon: BadgeCheck },
  ];

  const heroImage = business.banner || FALLBACK_MODEL_IMAGE;

  return (
    <section id="inicio" className="relative overflow-hidden bg-[#edf5ff] py-4 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-[1200px] px-3 sm:px-5 lg:px-6">
        <div className="relative overflow-hidden rounded-[30px] border border-[#dfeeff] bg-[#edf5ff] shadow-[0_24px_80px_rgba(14,73,143,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(31,99,220,0.08),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(91,156,255,0.10),transparent_18%),radial-gradient(circle_at_70%_100%,rgba(134,180,255,0.16),transparent_32%)]" />
          <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#dfeeff] blur-3xl opacity-90" />
          <div className="absolute right-20 top-16 h-48 w-48 rounded-full bg-[#dfeeff] blur-3xl opacity-80" />
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-[#dfeeff] blur-3xl opacity-75" />

          <div className="relative px-5 pb-4 pt-6 sm:px-7 sm:pb-5 sm:pt-8 lg:px-10 lg:pb-6 lg:pt-10">
            <div className="grid items-end gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:gap-2">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="relative z-10 flex max-w-[450px] flex-col justify-center pb-3 lg:pb-0"
              >
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#bdd7ff] bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d4f9a] shadow-sm backdrop-blur-sm">
                  <StoreIcon size={11} />
                  Bem-vindo à nossa loja
                </div>

                <h1 className="mt-5 max-w-[380px] text-[2.1rem] font-extrabold leading-[0.96] tracking-[-0.06em] text-[#0f2d52] sm:text-[2.7rem] lg:text-[4rem]">
                  Moda que combina
                  <span className="block">com o seu estilo</span>
                </h1>

                <p className="mt-4 max-w-[380px] text-sm leading-6 text-[#556882] sm:text-[0.98rem] lg:text-base lg:leading-7">
                  {business.description || 'Roupas modernas, confortáveis e com a qualidade que você merece. Compre de forma simples e segura, com entrega rápida em todo o país.'}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onExploreClick}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(37,99,235,0.25)] transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                    style={{ backgroundColor: accent }}
                  >
                    <ShoppingBag size={17} />
                    Ver categorias
                  </button>

                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#dfe7f2] bg-white px-5 py-3 text-sm font-bold text-[#1d2b45] shadow-sm transition-colors hover:bg-slate-50"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dff7e7] text-[#18a54b]">
                        <MessageCircle size={14} />
                      </span>
                      Fale connosco
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex min-h-[340px] items-end justify-center lg:min-h-[440px]"
              >
                <div className="absolute inset-x-6 bottom-3 h-16 rounded-full bg-[#d7eafc]/80 blur-2xl" />

                <div className="absolute right-[12%] top-6 rounded-full border border-[#dfeeff] bg-white/80 px-3 py-2 text-[11px] font-semibold italic text-[#1f4d93] shadow-[0_16px_30px_rgba(31,77,147,0.12)] backdrop-blur-sm">
                  Seu estilo,
                  <span className="block text-[10px] not-italic text-[#1f4d93]">nossa prioridade!</span>
                </div>

                <div className="absolute right-2 top-28 flex items-center gap-2 rounded-[18px] border border-[#eef4ff] bg-white/85 px-3 py-2 shadow-[0_16px_28px_rgba(31,77,147,0.12)] backdrop-blur-sm sm:right-6 lg:right-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff3d9] text-[#f59e0b] shadow-sm">
                    <Flame size={15} />
                  </div>
                  <div className="leading-none">
                    <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#1d4f9a]">Mais vendidos</div>
                  </div>
                </div>

                <div className="relative flex h-[300px] w-full max-w-[520px] items-end justify-center sm:h-[340px] lg:h-[420px]">
                  <img
                    src={heroImage}
                    alt={business.name}
                    onError={(event) => {
                      const target = event.currentTarget as HTMLImageElement;
                      target.src = FALLBACK_MODEL_IMAGE;
                    }}
                    className="relative z-10 h-full w-full object-contain object-bottom"
                    style={{
                      maskImage: 'linear-gradient(to right, transparent 0%, #000 9%, #000 89%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 79%, transparent 100%)',
                      maskComposite: 'intersect',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 9%, #000 89%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 79%, transparent 100%)',
                      WebkitMaskComposite: 'source-in',
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:mt-3 lg:grid-cols-4">
              {trustItems.map(({ label, description, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-[18px] border border-[#dfeeff] bg-white/70 px-3 py-2.5 shadow-[0_10px_20px_rgba(14,73,143,0.04)] backdrop-blur-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#1d4f9a]" style={{ backgroundColor: `${accent}18` }}>
                    <Icon size={14} />
                  </span>
                  <div className="leading-tight">
                    <div className="text-[10px] font-bold text-[#102a54] sm:text-[11px]">{label}</div>
                    <div className="text-[9px] text-[#5d6e83] sm:text-[10px]">{description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1 text-[#476188]"
            onClick={onExploreClick}
            aria-label="Ver catálogo"
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">Ver catálogo</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
              <ChevronDown size={18} />
            </motion.span>
          </button>
        </div>
      </div>
    </section>
  );
}
