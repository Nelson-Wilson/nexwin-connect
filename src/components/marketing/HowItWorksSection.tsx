import { motion } from 'motion/react';
import { UserPlus, Palette, PackagePlus, Share2, ShoppingCart } from 'lucide-react';
import SectionIntro from './SectionIntro';

const STEPS = [
  { icon: UserPlus, title: 'Criar conta', description: 'Registe-se com o seu e-mail em menos de um minuto, sem burocracia.' },
  { icon: Palette, title: 'Personalizar loja', description: 'Escolha as cores, adicione o seu logótipo e deixe a loja com a sua identidade.' },
  { icon: PackagePlus, title: 'Cadastrar produtos', description: 'Carregue fotos, preços e categorias dos seus produtos ou serviços.' },
  { icon: Share2, title: 'Compartilhar link', description: 'Divulgue a sua loja no WhatsApp, Instagram e Facebook com um único link.' },
  { icon: ShoppingCart, title: 'Receber pedidos', description: 'Os clientes escolhem os produtos e falam consigo directamente pelo WhatsApp.' },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Do zero à primeira venda"
          title="Como funciona"
          description="Cinco passos simples entre criar a conta e receber o primeiro pedido."
        />

        <ol className="relative grid grid-cols-1 lg:grid-cols-5 gap-y-10 lg:gap-6">
          {/* Timeline rail: vertical on mobile, horizontal on desktop */}
          <span className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-200 via-violet-200 to-emerald-200 lg:hidden" />
          <span className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200" />

          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative flex lg:flex-col lg:items-center gap-5 lg:gap-0 lg:text-center"
            >
              <span className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white font-display font-extrabold flex items-center justify-center ring-8 ring-slate-50 shadow-lg shadow-blue-600/25">
                {index + 1}
              </span>
              <div className="lg:mt-5">
                <span className="hidden lg:flex w-11 h-11 mx-auto mb-3 rounded-xl bg-white border border-slate-200 items-center justify-center text-blue-600 shadow-sm">
                  <step.icon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed lg:max-w-[210px] lg:mx-auto">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
