/* MST3 세븐스플릿 service worker */
const CACHE='mst3seven-v12';
const ASSETS=['./','./index.html','./manifest.json',
  './icon-192.png','./icon-512.png','./icon-apple-180.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // 앱 셸만 캐시. API/프록시/구글은 항상 네트워크.
  if(u.origin===location.origin){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
