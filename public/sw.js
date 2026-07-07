// AILVIE Service Worker — offline app shell + safe caching
// Strategy:
//  - /api/*            : never cached (always network) — AI chat, TTS
//  - navigation/HTML   : network-first (fresh deploys), cache fallback when offline
//  - hashed assets/img : cache-first (fast + offline), revalidate in background
const CACHE = "ailvie-cache-v2";
const SHELL = ["/", "/index.html", "/manifest.json", "/icon.svg", "/avatar.png", "/icon-192.png"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return; // only GETs
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;       // only same-origin
  if (url.pathname.startsWith("/api/")) return;          // never cache API

  const isHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // network-first so new deploys are picked up; fall back to cache when offline
    e.respondWith(
      fetch(req)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then((m) => m || caches.match("/index.html")))
    );
    return;
  }

  // static assets (hashed JS/CSS, images, icons) -> cache-first
  e.respondWith(
    caches.match(req).then((m) => {
      const net = fetch(req)
        .then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; })
        .catch(() => m);
      return m || net;
    })
  );
});

// ---- Push notifications (health reminders) ----
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { try { d = { body: e.data && e.data.text() }; } catch (__) {} }
  const title = d.title || "AILVIE";
  const opts = {
    body: d.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || "ailvie-alert",
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 150, 300, 150, 300],
    data: { url: d.url || "/?alerts=1" },
    actions: [
      { action: "alerts", title: "UYARILAR" },
      { action: "ok", title: "OK" }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "ok") return;
  const url = (e.notification.data && e.notification.data.url) || "/?alerts=1";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cls) => {
      for (const c of cls) {
        if ("focus" in c) { c.focus(); c.postMessage({ type: "OPEN_ALERTS" }); return; }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
