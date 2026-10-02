import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import SectionIntro from './SectionIntro';

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
    <section id="faq" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="Dúvidas frequentes" title="Perguntas frequentes" description="Tudo o que precisa de saber antes de começar." />
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl overflow-hidden transition-colors bg-white border ${isOpen ? 'border-blue-200 shadow-md shadow-blue-600/5' : 'border-slate-200'}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white rotate-45' : 'bg-slate-100 text-slate-500'}`}>
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 sm:px-6 pb-5 text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
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
