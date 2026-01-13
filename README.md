# Refuel Assist

Kısa: Uçuş operasyonları için yakıt hesaplama aracı (PWA).

Yerel çalıştırma:

```powershell
python -m http.server 8000
# Sonra tarayıcıda http://127.0.0.1:8000 açın
```

PWA / offline:
- `manifest.json` ve `sw.js` mevcut; servis worker `sw.js` cache listesindeki dosyalar kontrol edildi.

GitHub'a yükleme:
1. GitHub üzerinde boş bir repo oluşturun.
2. Yerelde şu komutları çalıştırın:

```bash
git remote add origin <REPO_URL>
git branch -M main
git push -u origin main
```

Not: Uygulamayı yayımlamak için GitHub Pages veya başka bir HTTPS sunucu kullanın (PWA için HTTPS gerekir).
