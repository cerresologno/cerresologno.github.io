const CACHE_NAME = 'cerresologno-cache-v1';
const urlsToCache = [
  '/,
  '/home.html,
  '/contatti.html,
  '/dove.html,
  '/news.html,
  '/eventi.html,
  '/storia.html,
  '/evento1.html,
  '/evento2.html,
  '/news1.html,
  '/news2.html,
  // Use more generic patterns instead of specific chunk names
  // which can change with each build
  '/static/css/',
  '/static/js/',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
  // Remove specific asset paths that might not exist
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
