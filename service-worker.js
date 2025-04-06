<<<<<<< HEAD
const cacheName = 'proloco-cerre-sologno-v1';
const staticAssets = [
  './',
  './index.html',  // Add index.html
  './home.html',
  './news.html',
  './eventi.html',
  './contatti.html',
  './dove.html',
  './storia.html',
  './evento1.html',
  './evento2.html',
  './style.css',
  './script.js',
  './img/pietra.jpg',
  './img/icon-192x192.png',
  './img/icon-512x512.png',
  // Add common file types
  './manifest.json'
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

// Add activate event handler
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
          .map(key => caches.delete(key))
      );
    })
  );
=======
const cacheName = 'proloco-cerre-sologno-v1';
const staticAssets = [
  './',
  './index.html',  // Add index.html
  './home.html',
  './news.html',
  './eventi.html',
  './contatti.html',
  './dove.html',
  './storia.html',
  './evento1.html',
  './evento2.html',
  './style.css',
  './script.js',
  './img/pietra.jpg',
  './img/icon-192x192.png',
  './img/icon-512x512.png',
  // Add common file types
  './manifest.json'
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

// Add activate event handler
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
          .map(key => caches.delete(key))
      );
    })
  );
>>>>>>> 8f76def3e1a617694796d3e66887dfb3a91a4a87
});