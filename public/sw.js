/* ═══════════════════════════════════════════════════════════
   Malambe & Moda — Service Worker
   Strategy: Network-first with cache fallback
   Cache: Static assets are cached indefinitely
   ═══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'malambe-moda-v3';
const OFFLINE_URL = '/';

// Static assets to pre-cache
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET and Firebase/API requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (
    url.hostname.includes('firebaseapp.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebase.com') ||
    url.hostname.includes('anthropic.com')
  ) return;

  // For navigation requests: network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For assets: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const networkPromise = fetch(event.request).then((response) => {
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      }).catch(() => cached);
      return cached ?? networkPromise;
    })
  );
});
