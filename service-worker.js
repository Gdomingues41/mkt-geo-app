// Bump this version string whenever you update any file in the app,
// so devices that already installed it pick up the new version.
const CACHE_NAME = 'mktgeo-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './videos/barbearia.mp4',
  './videos/barbearia.jpg',
  './videos/joalheria.mp4',
  './videos/joalheria.jpg',
  './videos/salao-beleza.mp4',
  './videos/salao-beleza.jpg',
  './videos/maqtec.mp4',
  './videos/maqtec.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache anything new we fetch (same-origin only) so future visits stay offline-ready.
        if (event.request.method === 'GET' && response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
