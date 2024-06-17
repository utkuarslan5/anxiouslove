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

// Fetch event
self.addEventListener('fetch', event => {
  // Check if the request is cross-origin
  const isCrossOrigin = new URL(event.request.url).origin !== location.origin;

  // Handle the fetch request
  event.respondWith(
    fetch(event.request, {
      mode: isCrossOrigin ? 'cors' : 'same-origin', // Set mode to 'cors' for cross-origin requests
      credentials: 'same-origin' // Include credentials if necessary
    }).catch(error => {
      console.error('Fetch failed:', error);
      return new Response('Network error occurred', {
        status: 408,
        statusText: 'Network error occurred'
      });
    })
  );
});
