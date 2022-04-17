"use strict";
const npm_cache = 'npm-cache';
const sw = self;
sw.addEventListener('fetch', event => {
    const url = event.request.url;
    //console.log(url);
    if (event.request.url.indexOf('@') > -1) {
        caches.match(event.request).then(response => {
            if (!response) {
                caches.open(npm_cache).then(function (cache) {
                    return fetch(event.request).then(function (response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            }
        });
    }
    else {
        caches.open(npm_cache).then(function (cache) {
            return fetch(event.request).then(function (response) {
                cache.put(event.request, response.clone());
                return response;
            });
        });
    }
});
sw.addEventListener('fetch', event => {
    const url = event.request.url;
    //console.log(url);
    if (url.startsWith('https://esm.run') && url.endsWith('+esm')) {
        const newUrl = url.replace('https://esm.run/', 'https://cdn.jsdelivr.net/');
        event.respondWith(fetch(newUrl));
    }
    else {
        event.respondWith(caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return response || fetch(event.request);
        }));
    }
});
