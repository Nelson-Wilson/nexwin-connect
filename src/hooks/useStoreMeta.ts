import { useEffect } from 'react';
import type { Business } from '../models/business.model';
import { PLATFORM_NAME } from '../config/platform';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSONLD_ID = 'store-jsonld';

function setStoreJsonLd(business: Business) {
  let script = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = JSONLD_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: business.name,
    description: business.description || undefined,
    image: business.logo || undefined,
    telephone: business.whatsapp || undefined,
    url: window.location.href,
    address: business.address ? { '@type': 'PostalAddress', streetAddress: business.address } : undefined,
    currenciesAccepted: 'MZN',
  });
}

/**
 * Sets the page title and Open Graph tags to the tenant's identity so that
 * sharing the store link (WhatsApp, social media...) shows a proper preview
 * instead of the platform's generic metadata.
 */
export function useStoreMeta(business: Business | null) {
  useEffect(() => {
    if (!business) return;
    const previousTitle = document.title;
    const description = business.description || `Loja online de ${business.name}. Peça pelo WhatsApp.`;

    document.title = `${business.name} | ${PLATFORM_NAME}`;
    setMetaTag('property', 'og:title', business.name);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', window.location.href);
    if (business.logo) setMetaTag('property', 'og:image', business.logo);
    setMetaTag('name', 'description', description);
    setLinkTag('canonical', `${window.location.origin}/loja/${business.slug}`);
    setStoreJsonLd(business);

    return () => {
      document.title = previousTitle;
      document.getElementById(JSONLD_ID)?.remove();
    };
  }, [business]);
}
