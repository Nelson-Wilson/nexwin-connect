import { motion } from 'motion/react';
import { Store, Users, Rocket } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#0F172A] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">O que é a NexWin Connect</span>
          <h2 className="font-serif font-light italic text-2xl sm:text-3xl lg:text-4xl text-white mt-3 leading-snug max-w-3xl mx-auto">
            Uma plataforma criada para ajudar{' '}
            <span className="font-sans font-black not-italic tracking-tight uppercase text-gradient-blue">
              pequenos e médios negócios
            </span>{' '}
            a terem uma presença digital profissional, sem complicações.
          </h2>
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Em poucos minutos, qualquer empreendedor moçambicano pode criar a sua
            própria loja online, divulgar os seus produtos e vender directamente
            pelo WhatsApp — sem precisar de conhecimentos técnicos nem de
            orçamento para desenvolver um site.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">
          {[
            { icon: Store, title: 'A sua loja', text: 'Um espaço próprio, com o seu nome, o seu logótipo e as suas cores.' },
            { icon: Users, title: 'Os seus clientes', text: 'Um link fácil de partilhar em qualquer rede social ou grupo de WhatsApp.' },
            { icon: Rocket, title: 'O seu crescimento', text: 'Estatísticas e ferramentas para vender mais, todos os dias.' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 text-left"
            >
              <item.icon className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="font-display font-semibold text-white text-sm">{item.title}</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
