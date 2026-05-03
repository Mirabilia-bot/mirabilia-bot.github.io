const CACHE_NAME = 'kgm-live-v3'; // On passe en v3
const ASSETS = [
  './index.html',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force le nouveau SW à s'activer immédiatement
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Stratégie NETWORK FIRST : On cherche sur internet, si ça échoue, on prend le cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
