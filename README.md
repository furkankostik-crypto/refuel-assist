Refuel Assist — Production build helper

Bu repo statik PWA uygulamasıdır. Yapılabilecek üretim adımları:

- `manifest.json` ve `sw.js` sürüm numaraları senkronize edildi (v7.4.1).
- Basit `Content-Security-Policy` meta etiketleri eklendi.
- Basit bir `package.json` eklendi; yerel `build` script'i HTML/JS minify yapar (devDependencies yüklemeniz gerekir).

Hızlı kullanım:

1. Node.js yüklüyse proje kökünde:

```bash
npm install
npm run build
```

2. Oluşan `build/` klasörünü bir HTTPS sunucusunda servis edin (PWA ve Service Worker için HTTPS gereklidir).

Notlar ve öneriler:
- Inline stil ve script'ler kısıtlı olduğu için CSP şu anda `unsafe-inline` içeriyor. Daha yüksek güvenlik için inline scriptleri kaldırıp `nonce` veya hash tabanlı CSP uygulanması önerilir.
- Sunucuda uygun `Cache-Control` başlıklarını ayarlayın (assets için uzun ömür, HTML için kısa TTL veya etag).
- Release notes veya otomatik sürüm artışı için CI (GitHub Actions) eklenebilir.
 - Release notes veya otomatik sürüm artışı için CI (GitHub Actions) eklenebilir.

Offline test (hızlı):

- Yerel sunucuda test etmek için (ör. PowerShell):

```powershell
# Kök dizinde çalıştırın
$listener=New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
Write-Output 'Listening on http://localhost:8000/'
while ($listener.IsListening) {
	$context=$listener.GetContext()
	$req=$context.Request
	$path=$req.Url.AbsolutePath.TrimStart('/')
	if ($path -eq '') { $path='index.html' }
	$file=Join-Path (Get-Location) $path
	if (Test-Path $file) {
		$bytes=[System.IO.File]::ReadAllBytes($file)
		$context.Response.ContentLength64=$bytes.Length
		$context.Response.OutputStream.Write($bytes,0,$bytes.Length)
		$context.Response.OutputStream.Close()
	} else {
		$context.Response.StatusCode=404
		$context.Response.OutputStream.Close()
	}
}
```

- Chrome/Edge'te `http://localhost:8000` açıldıktan sonra DevTools > Application > Service Workers bölümünden servis çalışanını kayıt edip "Offline" modda sayfayı yenileyerek offline davranışı test edin.

Font ekleme:

- `assets/DejaVuSans.ttf` placeholder eklendi. PDF oluşturma için gerçek `DejaVuSans.ttf` dosyasını bu konuma koyun ve `sw.js` içinde cache listesine dahil edildiğini doğrulayın. Yerel font varsa PDF kütüphanesi çevrimdışı çalışırken daha güvenilir çıktı sağlar.

