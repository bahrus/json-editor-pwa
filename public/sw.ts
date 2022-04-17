const npm_cache = 'npm-cache';

const sw = self as any as ServiceWorkerGlobalScope;

sw.addEventListener('fetch', event => {
    if (event.request.url.indexOf('@') > -1) {
        caches.match(event.request).then(response => {
            if(!response) {
                console.log({url: event.request.url, fn: 'fetch1'});
                event.respondWith(
                    caches.open(npm_cache).then(function (cache) {
                        return fetch(event.request).then(function (response) {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    })
                );
            }
        });
    }else{
        event.respondWith(
            caches.open(npm_cache).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
        );
    }   
});



sw.addEventListener('fetch', async event => {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            console.log({url: event.request.url, fn: 'fetch2'});
            return response || fetch(event.request);
        })
    );
});