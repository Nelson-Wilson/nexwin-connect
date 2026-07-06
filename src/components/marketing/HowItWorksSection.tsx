import { motion } from 'motion/react';
import { UserPlus, Palette, PackagePlus, Share2, ShoppingCart } from 'lucide-react';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Criar conta',
    description: 'Registe-se com o seu e-mail em menos de um minuto, sem burocracia.',
  },
  {
    icon: Palette,
    title: 'Personalizar loja',
    description: 'Escolha as cores, adicione o seu logótipo e deixe a loja com a sua identidade.',
  },
  {
    icon: PackagePlus,
    title: 'Adicionar produtos',
    description: 'Carregue fotos, preços e categorias dos seus produtos ou serviços.',
  },
  {
    icon: Share2,
    title: 'Partilhar o link',
    description: 'Divulgue a sua loja no WhatsApp, Instagram e Facebook com um único link.',
  },
  {
    icon: ShoppingCart,
    title: 'Receber encomendas',
    description: 'Os clientes escolhem os produtos e falam consigo directamente pelo WhatsApp.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28 bg-[#0B1120] relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Do zero à primeira venda</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Como <span className="font-sans font-black not-italic tracking-tighter uppercase">funciona</span>
          </h2>
          <p className="text-slate-400 font-light mt-3 text-sm sm:text-base">
            Cinco passos simples entre criar a conta e receber a primeira encomenda.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25 mb-5">
                  <step.icon className="w-7 h-7 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0B1120] border border-blue-500/40 flex items-center justify-center text-[11px] font-bold text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-white text-base">{step.title}</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-[220px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
