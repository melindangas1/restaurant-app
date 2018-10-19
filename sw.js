var filesToCache = [
    './',
    './img/',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './index.html',
    './restaurant.html'
];

console.log('Service worker registered');

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response) {
                console.log(e.request, ' already in cache');
                return response;
            } else {
                console.log('Fetching ', e.request);
                return fetch(e.request).then(function(response) {
                    const clonedResponse = response.clone();

                    caches.open('v1').then(function(cache) {
                        cache.put(e.request, clonedResponse);
                    });

                    return response;
                }).catch(function(error) {
                    console.log('Error fetching: ', error);
                });
            }
        })
    );
});