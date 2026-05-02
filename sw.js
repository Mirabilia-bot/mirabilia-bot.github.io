const CACHE_NAME = 'kgm-expert-v2'; // On change de version pour forcer la mise à jour
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png'
];


self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Force le SW à s'activer tout de suite
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim()); // Prend le contrôle des pages ouvertes immédiatement
  console.log('Service Worker activé et opérationnel');
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
