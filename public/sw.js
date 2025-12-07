const CACHE_NAME = "nivra-cache-v1";
const OFFLINE_URLS = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
});

self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and chrome-extension/devtools requests
  if (event.request.method !== "GET") return;
  if (event.request.url.startsWith("chrome-extension://")) return;
  if (event.request.url.startsWith("devtools://")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Only cache valid HTTP responses
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const cloned = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() => caches.match("/"));
    })
  );
});
