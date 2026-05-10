const CACHE_NAME = 'oporail-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './src/css/main.css',
  './src/js/init-core.js',
  './src/js/api.js',
  './src/js/word-game.js',
  './src/js/seed-questions.js',
  './src/js/app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return from cache
        }
        return fetch(event.request); // Fallback to network
      })
  );
});
