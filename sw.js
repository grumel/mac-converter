var CACHE = 'mac-v4';

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-maskable.svg']);
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(n) {
        return n === CACHE ? null : caches.delete(n);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  // Nur im aktuellen Cache suchen: caches.match() ohne Namen durchsucht alle
  // Caches in Anlagereihenfolge, ein alter Eintrag wuerde den neuen verdecken.
  e.respondWith(
    caches.open(CACHE).then(function(c) { return c.match(e.request); })
      .then(function(r) { return r || fetch(e.request); })
  );
});
