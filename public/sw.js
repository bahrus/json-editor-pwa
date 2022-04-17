const npm_cache = 'npm-cache';


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(npm_cache).then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});



self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(response) {
        // if (response.status === 404) {
        //   return caches.match('pages/404.html');
        // }
        return response
      });
    }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('/offline.html');
    })
  );
});

