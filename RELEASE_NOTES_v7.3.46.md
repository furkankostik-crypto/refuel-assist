Refuel Assist — v7.3.46 (10 Ocak 2026)

Özet
- Service Worker cache/version: `refuel-assist-v7.3.46` (SW güncellendi).
- `manifest.json` ve sayfa başlıkları `v7.3.46` olarak güncellendi.
- In-app güncelleme bildirimi (banner) ve `sw_update_progress` i18n anahtarı eklendi/temizlendi.
- `install.html`: yükleme akışı ve i18n iyileştirmeleri.

Test & Dağıtım
1. Lokalde bir HTTP sunucusu ile test edin (ör. `python -m http.server 8000`) ve tarayıcıyı açın.
2. `index.html` veya `install.html` açıkken `navigator.serviceWorker.getRegistration().then(r=>r.update())` çalıştırarak yeni SW olup olmadığını kontrol edin.
3. Sunucu üzerinde `sw.js` içindeki `CACHE_NAME` değişikliği ile yeni sürüm tetiklenir; açık istemciler `NEW_VERSION` mesajı alacak.

Simülasyon
- Lokal test sırasında banner davranışını kontrol etmek için bu depo içinde `sw.js` geçici olarak `refuel-assist-v7.3.47` olarak güncellendi. Açık istemciler `NEW_VERSION` almalı ve `GÜNCELLE` sonrası sayfa yenilenip banner gizlenmelidir.

Yayınlama (GitHub)
- Değişiklikleri commitleyip tag atın, ardından `git push --follow-tags` ile gönderin.

Örnek komutlar:
```powershell
git add .
git commit -m "chore(release): v7.3.46 — SW cache bump, i18n and update-banner tweaks"
git tag -a v7.3.46 -m "Release v7.3.46"
git push origin main --follow-tags
```

Notlar
- Kullanıcılar uygulamanın zaten en son sürümünü kullanıyorsa in-app bildirim gösterilmez.
- Kapalı cihazlara bildirim için Web Push servisi gerekir; isterseniz bunu ekleyelim.
