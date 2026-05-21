const CACHE_NAME = 'kgm-live-v5'; // Incrémenté pour forcer le rafraîchissement
const ASSETS = [
  './',
  './index.html',
  './blog.html',
  './manifest.json',
  './communes.geojson',
  './pharmacies.geojson',
  './cartographie.html',
  // Articles et pages clés
  './marketing-territorial-togo.html',
  './Urban-Clean-SIG.html',
  './budget-participatif-togo-kgm.html',
  './article-gestion-dechets-agoe.html',
  './article-pdc-communal.html',
  './article-sig-gestion.html',
  './article-loi-2019.html',
  './delimitation-territoriale-togo.html',
  './gestion-patrimoine-communal-sig-togo.html',
  './gestion-inondations-lome.html',
  './villes-durables-togo.html',
  './maitrise-ouvrage-communale.html',
  // Ressources
  './images/icon-192.png',
  './images/icon-512.png'
];

// 1. Installation : Ajout sécurisé des assets
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.error('Cache addAll failed', err));
    })
  );
});

// 2. Activation : Nettoyage des versions obsolètes
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
});

// 3. Stratégie Hybride : Network First avec fallback vers offline.html
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return response;
      })
      .catch(async () => {
        // Essayer de trouver la page dans le cache
        const cachedResponse = await caches.match(e.request);
        if (cachedResponse) return cachedResponse;
        
        // Si ce n'est pas dans le cache, on renvoie la page de secours
        if (e.request.headers.get('accept').includes('text/html')) {
          return caches.match('./offline.html');
        }
      })
  );
});
