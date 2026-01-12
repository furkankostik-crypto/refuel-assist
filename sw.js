const CACHE_NAME = 'refuel-assist-v7.3.49';
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
  './assets/logo-512.png',
  './assets/logo.svg',
  './assets/pdf_calc_mapping.json',
  './assets/fuel-slip-blank-u.pdf',
  './assets/fuel-slip-blank.pdf',
  './assets/pdfjs/pdf.min.js',
  './assets/pdfjs/pdf.worker.min.js',
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const unique = Array.from(new Set(urlsToCache));

    const results = await Promise.all(unique.map(async url => {
      try {
        const response = await fetch(url);
        if (!response || !response.ok) return { url, ok: false, status: response && response.status };
        await cache.put(url, response.clone());
        return { url, ok: true };
      } catch (err) {
        return { url, ok: false, error: err && err.message };
      }
    }));

    const failed = results.filter(r => !r.ok);
    if (failed.length) console.warn('ServiceWorker: some resources failed to cache during install', failed);

    try {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (clientsList && clientsList.length) {
        clientsList.forEach(c => { try { c.postMessage({ type: 'NEW_VERSION', version: CACHE_NAME }); } catch (e) {} });
      }
    } catch (e) {}

    // Activate new service worker immediately so clients fetch the updated calc.html
    try { self.skipWaiting(); } catch (e) {}
  })());
});

self.addEventListener('message', event => {
  try {
    if (event && event.data) {
      if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
      else if (event.data.type === 'GET_VERSION') {
        try {
          const c = event.source || (event && event.ports && event.ports[0]);
          if (c && typeof c.postMessage === 'function') { try { c.postMessage({ type: 'CURRENT_VERSION', version: CACHE_NAME }); } catch (e) {} }
        } catch (e) {}
      }
    }
  } catch (e) {}
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response; })
        .catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Ensure calc.html is served network-first so updates appear immediately
  if (url.pathname.endsWith('/calc.html') || url.pathname.endsWith('calc.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response; })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (url.pathname.endsWith('/assets/fleet.json') || url.pathname.endsWith('/assets/tailCapacity.json')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response; })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

