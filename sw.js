/* ==========================================================================
   HundApp – Service Worker (sw.js)
   Version: 3.0.0
   100% Offline Support & PWA Engine for Forest Walks & Daily Dog Care
   ========================================================================== */

const CACHE_NAME = 'hundapp-v3.0-clean';

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
  'login.html',
  'register.html',
  'visitkort-preview.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'manifest.webmanifest',
  'hundapp-logo.svg',
  'hundapp-logo-dark.svg',
  'visitkort-framsida.svg',
  'visitkort-baksida.svg',
  'visitkort-komplett.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
  'merch/stickers-mockup.png',
  'merch/mug-mockup.png',
  'merch/hoodie-mockup.png',
  'merch/tshirt-mockup.png',
  'merch.html',
  'images/sigge-bordercollie.jpg',
  'images/buster-jackrussell.jpg',
  'images/bella-golden.jpg'
];

// Install Event: Precache all essential offline assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[HundApp SW] Precaching app shell & offline pages for forest mode...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Clean up old cache versions and claim clients
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

// Fetch Event: Stale-while-revalidate / Network-first with instant offline cache fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or external cross-origin analytics/APIs
  if (request.method !== 'GET') return;

  // Handle HTML document navigations (Network first with cache fallback)
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
          console.log('[HundApp SW] Offline in the forest. Serving cached page for:', url.pathname);
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to portal.html or index.html if specific page isn't in cache
            return caches.match('portal.html') || caches.match('index.html');
          });
        })
    );
    return;
  }

  // Handle static assets (CSS, JS, Images, Fonts) - Cache First with Background Update
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
        .catch(() => {
          // Network failed, nothing extra to do since cachedResponse is returned if present
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Background Sync / Message listeners
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
