# Refuel Assist

Kısa: Uçuş operasyonları için yakıt hesaplama aracı (PWA).

Yerel çalıştırma:

```markdown
# Refuel Assist

Kısa: Uçuş operasyonları için yakıt hesaplama aracı (PWA).

Yerel çalıştırma:

```powershell
python -m http.server 8000
# Tarayıcıda http://127.0.0.1:8000 açın
```

GitHub Pages (Actions) ile yayınlama

- Depoyu GitHub'a push'ladıktan sonra workflow zaten eklidir: `.github/workflows/deploy.yml`.
- GitHub repository ayarlarında "Pages" > "Source" kısmını "GitHub Actions" (ya da Actions tarafından otomatik) olarak bırakın.
- İlk push sonrası Action otomatik olarak siteyi deploy edecektir; siteniz `https://<username>.github.io/<repo>/` altında erişilebilir olacaktır.

Hızlı adımlar:

1. Lokal repo ayarları (sağlanmışsa atlayın):

```bash
git remote add origin <REPO_URL>
git branch -M main
git push -u origin main
```

2. GitHub'da repository -> Settings -> Pages kontrol edin; "Build and deployment" altında "GitHub Actions" seçili olmalı.

3. Action tamamlandığında Pages URL'sini kontrol edin. Gerekirse repo ana sayfasındaki Pages banner'ından erişin.

PWA notları

- `manifest.json` içindeki `start_url` göreli olacak şekilde ayarlanmıştır (örn. `.`). Bu, GitHub Pages alt dizinlerinde çalışmayı kolaylaştırır.
- Servis worker: `sw.js` önbelleğe alma stratejisi mevcut. GitHub Pages HTTPS üzerinden çalıştığı için SW düzgün çalışacaktır.

Yerel test için (HTTPS gerekli değilse):

```powershell
# Hızlı test
python -m http.server 8000
# Tarayıcıda http://127.0.0.1:8000 açın
```

Opsiyonel

- Eğer dosya adlarında başında `_` olan dosya varsa GitHub Pages tarafından Jekyll atlanmasını sağlamak için kök dizine `.nojekyll` dosyası eklenmiştir.

```
