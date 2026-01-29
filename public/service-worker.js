const CACHE_NAME = 'cindy-cache-v4';

// Install - activate immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate - delete ALL old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - always go to network (no caching for now to fix the issue)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
