/* Aquaproved Review (nl) - service worker
   Offline-werking op de werf. navigate=network-first, assets=cache-first (zelfde opbouw als de pleisterdikte-calculator). */
var CACHE = 'aqp-review-nl-v1-2-1-127';
self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) {
        return c.addAll(['./', './manifest.json', './icons/icon-192x192.png']).catch(function() {});
    }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;
    if (e.request.mode === 'navigate') {
        e.respondWith(fetch(e.request).then(function(resp) {
            var copy = resp.clone(); caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
            return resp;
        }).catch(function() { return caches.match(e.request); }));
    } else {
        e.respondWith(caches.match(e.request).then(function(hit) {
            if (hit) return hit;
            return fetch(e.request).then(function(resp) {
                if (resp && resp.status === 200) { var copy = resp.clone(); caches.open(CACHE).then(function(c) { c.put(e.request, copy); }); }
                return resp;
            });
        }));
    }
});
