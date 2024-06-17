// Import Workbox from the CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // Precache files
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Cache strategies
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Handle cross-origin requests
  workbox.routing.registerRoute(
    ({url}) => url.origin !== self.location.origin,
    new workbox.strategies.NetworkFirst({
      cacheName: 'cross-origin',
    })
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installed');
  // Activate the service worker immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});
