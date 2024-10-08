const CACHE_VERSION = "v1";
const CACHE_NAME = `microlensCache-${CACHE_VERSION}`;

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
  
      .then(() => {
        // Ensure that the new service worker activates immediately
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (
        response &&
        !navigator.onLine &&
        self.location.hostname !== "localhost"
      ) {
        console.log("Found in Cache");
        return response;
      }
  
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              if (event.request.method !== "POST") {
                cache.put(event.request, responseClone);
              }
            });
          }

          return response;
        })
        .catch(function (err) {
          console.log("Error Fetching & Caching New Data", err);
        });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
