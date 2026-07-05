import { useEffect } from 'react';
import type { Business } from '../models/business.model';

const DEFAULT_ICONS = [
  { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
  { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
];

/**
 * Swaps the document's <link rel="manifest"> for a Blob-generated one scoped
 * to this business (name, icon, theme colour, start_url = /loja/{slug}).
 * This lets each tenant's store be "Added to Home Screen" as its own app,
 * without needing a server to generate per-tenant manifest files.
 * Reverts to the platform's default manifest.json on unmount.
 */
export function useStoreManifest(business: Business | null, accent: string) {
  useEffect(() => {
    if (!business) return;

    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!link) return;
    const originalHref = link.href;

    const manifest = {
      name: business.name,
      short_name: business.name.slice(0, 20),
      description: business.description || `Loja online de ${business.name}. Peça pelo WhatsApp.`,
      start_url: `/loja/${business.slug}`,
      scope: `/loja/${business.slug}`,
      display: 'standalone',
      background_color: '#0F172A',
      theme_color: accent,
      lang: 'pt-MZ',
      icons: business.logo
        ? [
            { src: business.logo, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: business.logo, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ]
        : DEFAULT_ICONS,
    };

    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    link.setAttribute('href', blobUrl);

    return () => {
      link.setAttribute('href', originalHref);
      URL.revokeObjectURL(blobUrl);
    };
  }, [business, accent]);
}
