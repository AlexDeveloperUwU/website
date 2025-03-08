const CACHE_NAME = "cache-v1";

// Instalar el Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activar el SW inmediatamente
});

// Interceptar todas las solicitudes
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Evitar solicitudes a extensiones de Chrome
  if (requestUrl.protocol === "chrome-extension:") {
    return;
  }

  // Solo cachear recursos del mismo dominio (incluyendo localhost)
  if (
    requestUrl.origin === self.location.origin &&
    event.request.method === "GET"
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Devuelve de la caché si está disponible
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en caché, lo busca en la red y lo guarda en la caché
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone).catch((error) => {
                  console.error("Error cacheando recurso:", event.request.url, error);
                });
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error("Error al obtener recurso:", event.request.url, error);

            // Fallback para documentos si la red falla
            if (event.request.destination === "document") {
              return caches.match("/index.html");
            }
          });
      })
    );
  }
});

// Activar el Service Worker y eliminar cachés antiguas
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
