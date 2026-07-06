import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'É gratuito criar uma loja?',
    answer:
      'A criação da loja é gratuita durante os primeiros 7 dias, para experimentar a plataforma sem qualquer custo. Depois deste período, a continuidade da loja custa 799 MT por mês.',
  },
  {
    question: 'O que acontece depois dos 7 dias grátis?',
    answer:
      'A sua loja continua online e a sua conta passa a ser cobrada em 799 MT por mês, para manter o catálogo, o painel administrativo e as encomendas por WhatsApp activos.',
  },
  {
    question: 'Preciso de instalar alguma coisa?',
    answer:
      'Não. A NexWin Connect funciona directamente no navegador, tanto no computador como no telemóvel. A sua loja também pode ser instalada como aplicação (PWA) para acesso mais rápido.',
  },
  {
    question: 'Posso vender qualquer tipo de produto?',
    answer:
      'Sim. A plataforma serve moda, restaurantes, padarias, sorveterias, farmácias, papelarias, cosméticos, eletrónicos e muitos outros tipos de negócio.',
  },
  {
    question: 'Como funciona a integração com o WhatsApp?',
    answer:
      'Cada produto tem um botão que abre uma conversa de WhatsApp já preenchida com os detalhes da encomenda, para que o cliente feche a compra directamente consigo.',
  },
  {
    question: 'Posso personalizar a minha loja?',
    answer:
      'Sim. Pode adicionar o seu logótipo, escolher entre várias cores de tema e organizar categorias, banners e promoções ao seu gosto.',
  },
  {
    question: 'Posso mudar as cores da loja depois de criar?',
    answer:
      'Sim, a qualquer momento. As alterações de personalização ficam visíveis na sua loja pública de forma imediata.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#0B1120] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Dúvidas frequentes</span>
          <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-white mt-2">
            Perguntas <span className="font-sans font-black not-italic tracking-tighter uppercase">frequentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="glass-card rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-white text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-5 sm:px-6 pb-5 text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
