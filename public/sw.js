const npm_cache = 'npm-cache';


// self.addEventListener('activate', (event) => {
//   event.waitUntil((async () => {
//     // Enable navigation preload if it's supported.
//     // See https://developers.google.com/web/updates/2017/02/navigation-preload
//     if ('navigationPreload' in self.registration) {
//       await self.registration.navigationPreload.enable();
//     }
//   })());

//   // Tell the active service worker to take control of the page immediately.
//   self.clients.claim();
// });
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

