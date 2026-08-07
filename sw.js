const CACHE = 'rexipe-v5';
self.addEventListener('install', e => { self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html'])).catch(() => {})); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(
    k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit ||
    fetch(e.request).then(r => { const c = r.clone();
      caches.open(CACHE).then(x => x.put(e.request, c)).catch(() => {}); return r; })
    .catch(() => caches.match('index.html'))));
});
