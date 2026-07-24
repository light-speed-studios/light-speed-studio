self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("lss-app-v1").then((cache) => {
      return cache.addAll([
        "./index.html",
        "./css/styles.css",
        "./js/main.js",
        "./2337.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});