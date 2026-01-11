# Refuel Assist — Production Build & Deployment

Kısa: Bu repo statik HTML/JS/CSS uygulaması içerir. Aşağıdaki adımlar `dist/` klasörünü üretir ve GitHub Actions ile GitHub Pages'e yayınlamaya hazır hale getirir.

Hızlı komutlar

- Build (yerel):
```powershell
python build.py
```

- Yerelde test et (basit HTTP server):
```powershell
python -m http.server --directory dist 8080
# sonra tarayıcıda http://localhost:8080 açın
```

Yayınlama

- GitHub Pages: `deploy-gh-pages.yml` workflow'u `main` veya `master` branch'e push edildiğinde `dist/`'i `gh-pages` branşına yayınlar.
- Netlify/Vercel: `dist/` klasörünü build olarak upload edin veya repo bağlayıp build komutu olarak `python build.py` belirtin ve publish klasörü olarak `dist/` seçin.

Notlar

- `build.py` basit HTML minifikasyonu yapar (yorumları kaldırır, fazla boşlukları daraltır). Karmaşık JS içindeki HTML gibi durumlarda manuel kontrol önerilir.
