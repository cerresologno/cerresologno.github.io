const CACHE_NAME = 'cerresologno-cache-v2'; // Versione cache aggiornata
const STATIC_ASSETS_CACHE_NAME = 'cerresologno-static-assets-v2';
const DYNAMIC_CONTENT_CACHE_NAME = 'cerresologno-dynamic-content-v2';

// Risorse statiche fondamentali
const staticUrlsToCache = [
  './',
  './style.css',
  './mobile.css',
  './card-style.css',
  './script.js',
  './manifest.json',
  './pietra.jpg',
  './cerre2.jpeg',
  './Villa-Minozzo_1.1-225x300.webp',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Pagine che beneficiano di stale-while-revalidate
const dynamicUrlsPattern = [
  /\/home\.html$/,
  /\/news\.html$/,
  /\/eventi\.html$/,
  /\/ricette\.html$/,
  /\/attività\.html$/,
  /\/contatti\.html$/,
  /\/storia\.html$/,
  /\/dove\.html$/,
  /\/eventi\/.*\.html$/,
  /\/news\/.*\.html$/,
  /\/ricette\/.*\.html$/,
  /\/rifugi\/.*\.html$/,
  /\/dove-mangiare\/.*\.html$/
];

// Tutte le URL da pre-cachare all'installazione (principalmente statiche)
const urlsToPreCache = [
  './',
  './home.html',
  './style.css',
  './mobile.css',
  './card-style.css',
  './script.js',
  './manifest.json',
  './pietra.jpg',
  './cerre2.jpeg',
  './Villa-Minozzo_1.1-225x300.webp',
  './contatti.html',
  './dove.html',
  './eventi.html',
  './news.html',
  './ricette.html',
  './storia.html',
  './attività.html',
  // Aggiungi qui le pagine dettaglio più importanti se vuoi pre-caricarle
  // es. './eventi/eventoImportante.html'
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];
// const urlsToCache = [ // Rimpiazzato da urlsToPreCache
  './',
  './home.html',
  './style.css',
  './mobile.css',
  './card-style.css',
  './script.js',
  './manifest.json',
  './pietra.jpg',
  './cerre2.jpeg',
  './Villa-Minozzo_1.1-225x300.webp',
  './contatti.html',
  './dove.html',
  './eventi.html',
  './news.html',
  './ricette.html',
  './storia.html',
  './attività.html',
  './eventi/evento3.html',
  './eventi/evento4.html',
  './news/news4.html',
  './ricette/ricetta-erbazzone.html',
  './rifugi/rifugio-bargetana.html',
  './rifugi/rifugio-battisti.html',
//   'https://fonts.googleapis.com/icon?family=Material+Icons' // Cache Google Fonts
// ];

self.addEventListener('install', event => {
  self.skipWaiting(); // Forza l'attivazione del nuovo service worker
  event.waitUntil(
    caches.open(STATIC_ASSETS_CACHE_NAME)
      .then(cache => {
        console.log('Opened static assets cache and adding core static assets');
        return cache.addAll(urlsToPreCache); // Usa urlsToPreCache
      })
      .then(() => caches.open(DYNAMIC_CONTENT_CACHE_NAME)) // Apri anche la cache dinamica
      .then(cache => {
        console.log('Opened dynamic content cache');
        // Eventualmente pre-carica qui alcune risorse dinamiche se strettamente necessario
        return Promise.resolve();
      })
      .catch(error => {
        console.error('Cache failed:', error);
        // Continue with installation even if caching fails
      })
  );
});

self.addEventListener('fetch', event => {
  // Ignora richieste non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Strategia Stale-While-Revalidate per contenuti dinamici
  if (dynamicUrlsPattern.some(pattern => pattern.test(requestUrl.pathname))) {
    event.respondWith(
      caches.open(DYNAMIC_CONTENT_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(error => {
            console.warn('Fetch failed; returning offline page instead.', error);
            // Potresti voler restituire una pagina offline generica qui
            // return caches.match('./offline.html');
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategia Cache-First per asset statici (con fallback alla rete e caching)
  // Questo copre le risorse in staticUrlsToCache e altre richieste di asset statici
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request.clone()).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            // Non cachare risposte non valide o di tipo 'opaque' (es. CDN di terze parti senza CORS)
            // se non esplicitamente gestite.
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(STATIC_ASSETS_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
      .catch(error => {
        console.warn('Fetch failed; returning offline page instead.', error);
        // Potresti voler restituire una pagina offline generica qui
        // return caches.match('./offline.html');
      })
    );
});

self.addEventListener('activate', event => {
  clients.claim(); // Prende il controllo immediato delle pagine aperte
  const cacheWhitelist = [STATIC_ASSETS_CACHE_NAME, DYNAMIC_CONTENT_CACHE_NAME]; // Aggiorna whitelist
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});