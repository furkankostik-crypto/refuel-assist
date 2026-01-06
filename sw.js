const CACHE_NAME = 'refuel-assist-v7.3.43';
const urlsToCache = [
  './',
  './index.html',
  './install.html',
  './calc.html',
  './manifest.json',
  './assets/fleet.json',
  './assets/tailCapacity.json',
  './assets/tailCapacityLoader.js',
  './assets/airbus.svg',
  './assets/boeing.svg',
  './assets/logo-192.png',
  './assets/logo-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('message', event => {
  try {
    if (event && event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  } catch (e) {}
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Navigasyon (HTML) isteklerinde güncel sürümü tercih et
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Kritik JSON'lar: network-first (fleet/capacity güncel kalsın)
  if (
    url.pathname.endsWith('/assets/fleet.json') ||
    url.pathname.endsWith('/assets/tailCapacity.json')
  ) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Diğer assetlerde cache-first
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
