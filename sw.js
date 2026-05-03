const CACHE_NAME = 'kgm-live-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './communes.geojson',
  './pharmacies.geojson',
  '/cartographie.html',
  './images/icon-192.png',
  './images/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
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
