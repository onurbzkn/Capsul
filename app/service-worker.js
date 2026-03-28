// ─────────────────────────────────────────────────────────────────────────────
// Capsula — Service Worker
// Strateji:
//   • App shell (HTML, manifest, ikonlar) → Cache First
//   • Google Fonts CSS → Stale While Revalidate
//   • Google Fonts dosyaları (.woff2) → Cache First (1 yıl)
//   • formspree.io (iletişim formu) → Network Only (offline'da sessizce hata ver)
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_VERSION = 'capsula-v18';

// İlk yüklemede cache'e alınacak app shell dosyaları
const APP_SHELL = [
  '/app/',
  '/app/index.html',
  '/app/app.css',
  '/app/lang.js',
  '/app/app1.js',
  '/app/app2.js',
  '/app/manifest.json',
  '/app/icon-192.png',
  '/app/icon-512.png',
];

// ── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // yeni SW hemen aktif olsun
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key)) // eski cache versiyonlarını temizle
      ))
      .then(() => self.clients.claim()) // açık sekmeleri hemen kontrol al
  );
});

// ── FETCH ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Google APIs ve formspree → her zaman network
  if (url.hostname === 'accounts.google.com' || url.hostname === 'www.googleapis.com' || url.hostname === 'oauth2.googleapis.com') {
    event.respondWith(fetch(request));
    return;
  }

  // formspree.io → her zaman network, offline'da sessizce başarısız
  if (url.hostname === 'formspree.io') {
    event.respondWith(fetch(request).catch(() =>
      new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    ));
    return;
  }

  // Google Fonts .woff2 dosyaları → Cache First (font bytes değişmez)
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, 'capsula-fonts'));
    return;
  }

  // Google Fonts CSS → Stale While Revalidate (CSS güncellenebilir)
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, 'capsula-fonts'));
    return;
  }

  // App shell ve local dosyalar → Cache First, network fallback
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, CACHE_VERSION));
    return;
  }
});

// ── STRATEJİLER ───────────────────────────────────────────────────────────────

// Cache First: önce cache'e bak, yoksa network'ten al ve cache'le
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    // Offline ve cache'de yok — uygulama kendi hatasını yönetir
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate: cache'den hemen dön, arka planda güncelle
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || await networkPromise;
}
