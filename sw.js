/* ==========================================================================
   HundApp – Service Worker (sw.js)
   Version: 3.2.0
   100% Offline Support & PWA Engine for Forest Walks & Daily Dog Care
   ========================================================================== */

const CACHE_NAME = 'hundapp-v3.2-clean';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'portal.html',
  'dogs.html',
  'walks.html',
  'calendar.html',
  'statistics.html',
  'tips.html',
  'suggestions.html',
  'merch.html',
  'login.html',
  'register.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'manifest.webmanifest',
  'hundapp-logo.svg',
  'hundapp-logo-dark.svg'
];

// Install Event: Precache essential offline app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[HundApp SW] Precaching app shell & offline pages...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[HundApp SW] Cache addAll warning:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[HundApp SW] Removing outdated cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event: Stale-while-revalidate / Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('portal.html') || caches.match('index.html');
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
