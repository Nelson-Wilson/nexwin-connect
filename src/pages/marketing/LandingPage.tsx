import { useEffect } from 'react';
import MarketingHeader from '../../components/marketing/MarketingHeader';
import HeroSection from '../../components/marketing/HeroSection';
import SegmentsSection from '../../components/marketing/SegmentsSection';
import HowItWorksSection from '../../components/marketing/HowItWorksSection';
import BenefitsSection from '../../components/marketing/BenefitsSection';
import FeaturesSection from '../../components/marketing/FeaturesSection';
import ShowcaseSection from '../../components/marketing/ShowcaseSection';
import StatsSection from '../../components/marketing/StatsSection';
import PlatformTestimonialsSection from '../../components/marketing/PlatformTestimonialsSection';
import PricingSection from '../../components/marketing/PricingSection';
import FaqSection from '../../components/marketing/FaqSection';
import FinalCtaSection from '../../components/marketing/FinalCtaSection';
import MarketingFooter from '../../components/marketing/MarketingFooter';
import { platformStatsService } from '../../services/platformStatsService';

const SEO_TITLE = 'NexWin Connect — Crie a sua Loja Online em Minutos';
const SEO_DESCRIPTION =
  'Crie a sua loja online gratuitamente, personalize-a e venda pelo WhatsApp. A plataforma NexWin Connect ajuda pequenos e médios negócios de Moçambique a crescerem digitalmente, sem programação.';

function setMetaTag(selector: string, attribute: string, content: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attribute, content);
}

// Módulo carrega uma vez por sessão de navegação — suficiente para evitar
// a duplicação de contagem causada pelo duplo efeito do StrictMode em dev,
// sem impedir que uma nova visita (novo carregamento de página) some +1.
let hasRegisteredView = false;

export default function LandingPage() {
  // A homepage institucional é a porta de entrada da plataforma, por isso
  // assume as tags de SEO globais do <head> enquanto está montada. As
  // páginas da loja pública e do painel administrativo não dependem destas
  // tags para funcionar — apenas o <title>/meta cosmético da aba do browser.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = SEO_TITLE;
    setMetaTag('meta[name="description"]', 'content', SEO_DESCRIPTION);
    setMetaTag('meta[property="og:title"]', 'content', SEO_TITLE);
    setMetaTag('meta[property="og:description"]', 'content', SEO_DESCRIPTION);
    setMetaTag('meta[name="twitter:title"]', 'content', SEO_TITLE);
    setMetaTag('meta[name="twitter:description"]', 'content', SEO_DESCRIPTION);

    return () => {
      document.title = previousTitle;
    };
  }, []);

  // Regista uma visita real à homepage — alimenta a estatística
  // "Visualizações da Página" na secção de números da plataforma.
  // O guard evita contar duas vezes por causa do StrictMode do React em
  // desenvolvimento (que invoca efeitos duas vezes de propósito).
  useEffect(() => {
    if (hasRegisteredView) return;
    hasRegisteredView = true;
    platformStatsService.registerPageView();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <MarketingHeader />
      <main>
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SegmentsSection />
        <ShowcaseSection />
        <StatsSection />
        <PlatformTestimonialsSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
