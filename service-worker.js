const CACHE_NAME = 'amdox-erp-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/css/base.css',
  '/css/panels.css',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
