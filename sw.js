const CACHE_NAME = 'refuel-assist-v8.0.3';
const urlsToCache = [
  './',
  './index.html',
  './install.html',
  './calc.html',
  './block-time.html',
  './mel-calc.html',
  './converter.html',
  './engine-test.html',
  './towing.html',
  './manifest.json',
  './assets/db.js',
  './assets/fleet.json',
  './assets/tailCapacity.json',
  './assets/pdf_field_map.json',
  './assets/fuel-slip-blank.pdf',
  './assets/tailCapacityLoader.js',
  './assets/pdf-lib.min.js',
  './assets/fontkit.umd.js',
  './assets/airbus.svg',
  './assets/boeing.svg',
  './assets/logo-192.png',
  './assets/logo-512.png',
  './assets/airports.json',
  './assets/parkpos.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
      .then(() => {
        // Aktifleştirme beklemeden önce yeni sürüm olduğunu clientlara bildir
        return self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(clients => {
          if (clients && clients.length) {
            clients.forEach(c => {
              try { c.postMessage({ type: 'NEW_VERSION', version: CACHE_NAME }); } catch (e) {}
            });
          }
        });
      })
  );
});

self.addEventListener('message', event => {
  try {
    if (event && event.data) {
      if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
      } else if (event.data.type === 'GET_VERSION') {
        try {
          const c = event.source || (event && event.ports && event.ports[0]);
          if (c && typeof c.postMessage === 'function') {
            try { c.postMessage({ type: 'CURRENT_VERSION', version: CACHE_NAME }); } catch (e) {}
          }
        } catch (e) {}
      }
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
        .catch(() => {
          // Önce tam URL ile dene, sonra pathname ile, en son fallback
          return caches.match(event.request)
            .then(r => {
              if (r) return r;
              // Pathname'e göre cache'ten bul (GitHub Pages uyumluluğu)
              const pathname = url.pathname;
              const filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html';
              return caches.match('./' + filename);
            })
            .then(r => r || caches.match('./index.html'));
        })
    );
    return;
  }

  // Kritik JSON'lar: network-first (fleet/capacity güncel kalsın)
  if (
    url.pathname.endsWith('/assets/fleet.json') ||
    url.pathname.endsWith('/assets/tailCapacity.json') ||
    url.pathname.endsWith('/assets/pdf_field_map.json')
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
