"use strict";
const npm_cache = 'npm-cache';
const sw = self;
sw.addEventListener('fetch', async (event) => {
    if (event.request.url.indexOf('@') > -1) {
        const response = await caches.match(event.request);
        if (response)
            return;
    }
    event.respondWith(caches.open(npm_cache).then(function (cache) {
        return fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
        });
    }));
});
sw.addEventListener('fetch', async (event) => {
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    }));
});
