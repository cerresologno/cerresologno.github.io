const CACHE_NAME = 'cerresologno-cache-v1';
const urlsToCache = [
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
  'https://fonts.googleapis.com/icon?family=Material+Icons' // Cache Google Fonts
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache failed:', error);
        // Continue with installation even if caching fails
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use
        return fetch(event.request.clone())
          .then(response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
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