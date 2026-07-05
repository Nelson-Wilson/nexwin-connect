import { describe, it, expect, vi } from 'vitest';
import handler from './sitemap.xml';

// NOTE: this sandbox has no network access to Supabase, so calling the real
// handler here genuinely exercises the "Supabase unreachable" fallback
// path — it is not mocked to simulate failure, it actually fails and falls
// back, which is exactly the resilience property we want verified. The
// "returns store URLs from Supabase" path is NOT covered here — that needs
// a real project (see SETUP_PLATFORM.md).

function mockResponse() {
  const headers: Record<string, string> = {};
  let statusCode = 0;
  let body = '';
  const res = {
    setHeader: vi.fn((name: string, value: string) => {
      headers[name] = value;
    }),
    status: vi.fn((code: number) => {
      statusCode = code;
      return res;
    }),
    send: vi.fn((b: string) => {
      body = b;
    }),
  };
  return { res, headers, getStatus: () => statusCode, getBody: () => body };
}

describe('GET /sitemap.xml', () => {
  it('returns valid XML with static URLs even when Firestore is unreachable', async () => {
    const { res, headers, getStatus, getBody } = mockResponse();
    await handler({ headers: { host: 'example.com' } }, res as any);

    expect(getStatus()).toBe(200);
    expect(headers['Content-Type']).toContain('application/xml');
    expect(headers['Cache-Control']).toContain('s-maxage');

    const body = getBody();
    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(body).toContain('<loc>https://example.com/</loc>');
    expect(body).toContain('<loc>https://example.com/#catalogo</loc>');
  });

  it('uses the request host to build absolute URLs', async () => {
    const { res, getBody } = mockResponse();
    await handler({ headers: { host: 'minha-loja.example.com' } }, res as any);
    expect(getBody()).toContain('https://minha-loja.example.com/');
  });

  it('falls back to localhost when no host header is present', async () => {
    const { res, getBody } = mockResponse();
    await handler({ headers: {} }, res as any);
    expect(getBody()).toContain('https://localhost/');
  });
});
