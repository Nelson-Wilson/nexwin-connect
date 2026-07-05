/**
 * UUID v4 generator with fallback.
 *
 * `crypto.randomUUID()` only exists in "secure contexts" (HTTPS, or
 * `http://localhost`) — it's undefined when the app is opened via a plain
 * HTTP LAN IP (e.g. testing from a phone on the same network,
 * `http://10.x.x.x:3000`), which throws "crypto.randomUUID is not a
 * function". `crypto.getRandomValues()` has no such restriction, so it's
 * used as the primary fallback; a `Math.random()`-based generator is the
 * last resort for very old/unusual browsers.
 *
 * These IDs are only ever used as client-generated primary keys (never as
 * security tokens), so the reduced randomness of the last-resort fallback
 * is an acceptable trade-off for compatibility.
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
  }

  // eslint-disable-next-line no-console
  console.warn('generateUUID: Web Crypto API indisponível, a usar fallback Math.random() (menos aleatório).');
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
