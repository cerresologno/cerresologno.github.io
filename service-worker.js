const cacheName = 'proloco-cerre-sologno-v1';
const staticAssets = [
  './',
  './home.html',
  './news.html',
  './eventi.html',
  './contatti.html',
  './dove.html',
  './style.css',
  './script.js',
  './img/pietra.jpg',
  './img/icon-192x192.png',
  './img/icon-512x512.png'
];

self.addEventListener('install', async event => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cachedResponse = await caches.match(req);
    return cachedResponse;
  }
}