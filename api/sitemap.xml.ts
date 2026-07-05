/**
 * GET /sitemap.xml — generated at request time (see vercel.json rewrite).
 *
 * Lists the static marketing/legacy URLs (same ones the old static
 * sitemap.xml had) plus one entry per ACTIVE tenant store, read live from
 * Supabase. Never throws: if Supabase is unreachable for any reason, it
 * still returns valid XML with just the static URLs, so a transient error
 * never breaks the sitemap for crawlers.
 *
 * NOTE ON APPROACH: this uses the same public Supabase anon key already
 * used by the frontend (VITE_SUPABASE_* env vars), not a service-role key —
 * it works because `businesses` has a public "select" RLS policy already
 * (see supabase/migrations/0001_init.sql). This avoids provisioning a
 * service-role key just for a read-only, publicly-permitted table. If this
 * endpoint ever needs to read non-public data, switch to a service-role
 * client instead.
 *
 * ⚠️ Not verified against a live Supabase instance — the sandbox this was
 * written in has no network access to Supabase. Test after deploying:
 *   curl https://<your-domain>/sitemap.xml
 */
import { createClient } from '@supabase/supabase-js';

// Minimal structural types for a Node-runtime Vercel function — avoids
// depending on the @vercel/node package (which pulls in several packages
// with known ReDoS advisories) just for a request/response shape.
interface ApiRequest {
  headers: { host?: string; [key: string]: string | string[] | undefined };
}
interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  send(body: string): void;
}

const STATIC_URLS = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/#catalogo', changefreq: 'daily', priority: '0.9' },
  { path: '/#malambe', changefreq: 'weekly', priority: '0.8' },
  { path: '/#contato', changefreq: 'monthly', priority: '0.7' },
];

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function fetchActiveStoreSlugs(): Promise<{ slug: string; lastmod: string }[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from('businesses')
      .select('slug, updated_at')
      .eq('status', 'active');
    if (error) throw error;
    return (data ?? []).map((row) => ({
      slug: row.slug as string,
      lastmod: ((row.updated_at as string) ?? new Date().toISOString()).slice(0, 10),
    }));
  } catch (err) {
    console.error('sitemap.xml: falha ao consultar lojas ativas, a usar só rotas estáticas.', err);
    return [];
  }
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const baseUrl = `https://${req.headers.host ?? 'localhost'}`;
  const today = new Date().toISOString().slice(0, 10);

  const stores = await fetchActiveStoreSlugs();

  const staticEntries = STATIC_URLS.map(
    (u) =>
      `  <url>\n    <loc>${escapeXml(baseUrl + u.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  );

  const storeEntries = stores.map(
    (s) =>
      `  <url>\n    <loc>${escapeXml(`${baseUrl}/loja/${s.slug}`)}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticEntries, ...storeEntries].join('\n')}\n</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
