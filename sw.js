const CACHE_NAME = 'wg-v1';
const ASSETS = [
'/',
'/index.html',
'/styles.css',
'/app.js',
'/manifest.json',
'/assets/icon-192.png',
'/assets/icon-512.png'
];

self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
);
self.skipWaiting();
});

self.addEventListener('activate', (e) => {
e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
// Network-first for HTML, cache-first for others
if (e.request.mode === 'navigate' || (e.request.method === 'GET' && e.request.headers.get('accept')?.includes('text/html'))) {
e.respondWith(
fetch(e.request).catch(() => caches.match('/index.html'))
);
return;
}

e.respondWith(
caches.match(e.request).then(resp => resp || fetch(e.request))
);
});
