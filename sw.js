/*
 * Site service worker — lean hand-rolled precacher.
 * The build id is stamped into every vtka6hm occurrence at export time
 * (export-static.mjs), so each deploy gets a fresh cache namespace.
 *
 * Strategies:
 *   - /_next/static/* and static assets  → cache-first (immutable)
 *   - document navigations               → network-first, offline → cached page or homepage shell
 *   - other same-origin GETs             → stale-while-revalidate (LRU-capped)
 */
const VER = "vtka6hm";
const CACHE = "site-" + VER;
const BASE = "/YousofLHC/";
const SHELL = BASE;
const IMMUTABLE_RE = /\/_next\/static\//;
const ASSET_RE = /\.(?:webp|avif|png|jpe?g|gif|svg|ico|woff2?|css|js)$/i;
const MAX_ENTRIES = 150;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith("site-") && k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

async function trimCache(name) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length <= MAX_ENTRIES) return;
  await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map((k) => cache.delete(k)));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== location.origin) return;

  // SECURITY: never cache or serve the admin panel from the SW.
  if (url.pathname.startsWith(BASE + "admin") || url.pathname === BASE + "admin") return;

  // Navigations: network-first so deploys show up immediately,
  // but instant + offline when the network is gone.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          return (
            (await caches.match(req)) ||
            (await caches.match(SHELL)) ||
            Response.error()
          );
        }
      })()
    );
    return;
  }

  // Immutable build output + images/fonts: cache-first.
  if (IMMUTABLE_RE.test(url.pathname) || ASSET_RE.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        const fresh = await fetch(req);
        if (fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
        }
        return fresh;
      })()
    );
    return;
  }

  // Everything else same-origin: stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res.ok) {
            cache.put(req, res.clone());
            trimCache(CACHE);
          }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })()
  );
});
