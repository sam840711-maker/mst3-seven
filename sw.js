/* MST3 세븐스플릿 service worker */
const CACHE='mst3seven-v21';
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
  if(u.origin!==location.origin) return;              // 프록시/구글/API는 그대로 네트워크
  const isDoc = e.request.mode==='navigate'
    || u.pathname.endsWith('/') || u.pathname.endsWith('index.html');
  if(isDoc){
    // HTML은 네트워크 우선 → 온라인이면 항상 최신, 오프라인이면 캐시
    e.respondWith(
      fetch(e.request).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        return res;
      }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
    );
  } else {
    // 정적 자원은 캐시 우선
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
