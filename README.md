# ✈️ Refuel Assist v7.6.0

**Flight Operations Support PWA** — Uçuş operasyonları için yakıt ikmali hesaplama uygulaması.

![Version](https://img.shields.io/badge/version-7.6.0-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 🚀 Özellikler

### Yakıt Hesaplama
- **Blok Yakıt** ve **FOB (Fuel On Board)** hesaplama
- Tank bazlı dağılım (LH / CENTER / RH)
- Yoğunluk ve sıcaklık dönüşümü
- Uplift hesabı (KG ve LTR)
- PDF fiş oluşturma ve kaydetme

### Filo Desteği
- **Airbus:** A320 Family (CEO/NEO), A330, A350
- **Boeing:** B737 NG/MAX, B777, B787
- Kuyruk kodu ile otomatik uçak tanıma (TC-XXX)
- Tank limitleri ve kapasite kontrolü

### Ek Araçlar
- 🕐 **Blok Saat Hesaplama** — Uçuş sürelerini kaydet ve toplamı gör
- 📅 **MEL Due Date** — MEL kategorileri (A/B/C/D) için bitiş tarihlerini hesapla
- 🔄 **Birim Dönüştürücü** — kg/lb, Nm/lbf·ft/lbf·in, km/h/mph/knot ve °C/°F dönüşümlerini yap
- 🛠️ **Motor Testi** — Havaalanı seçimi, METAR çekme ve Fuel On Time kronometre desteği ile ön çalışma kontrolü yap
- 🚜 **Towing Assist** — Uçak çekim (towing) operasyonları için checklist, zaman kaydı ve WhatsApp ile paylaşım desteği

### PWA Özellikleri
- 📱 Ana ekrana eklenebilir
- 📶 Çevrimdışı çalışma
- 🔄 Otomatik güncelleme
- 🌐 Çoklu dil desteği (TR/EN)

## 📦 Kurulum

### Canlı Demo
Uygulamayı doğrudan tarayıcınızda kullanabilirsiniz:

```
https://[your-github-username].github.io/refuel-assist/
```

### Yerel Geliştirme

```bash
# Repoyu klonla
git clone https://github.com/[your-username]/refuel-assist.git
cd refuel-assist

# Yerel sunucu başlat (Python)
python -m http.server 8080

# veya Node.js ile
npx serve .
```

Tarayıcıda `http://localhost:8080` adresini açın.

## 📁 Dosya Yapısı

```
refuel-assist/
├── index.html          # Ana sayfa (uçak seçimi)
├── towing.html         # Uçak çekim (towing) operasyonları
├── calc.html           # Yakıt hesaplama sayfası
├── block-time.html     # Blok saat hesaplama
├── mel-calc.html       # MEL due date hesaplama
├── converter.html      # Hızlı birim dönüştürücü
├── engine-test.html    # Motor testi ve Fuel On Time kronometre
├── install.html        # PWA yükleme sayfası
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
└── assets/
    ├── fleet.json          # Filo kuyruk kodları
    ├── tailCapacity.json   # Tank kapasiteleri
    ├── tailCapacityLoader.js
    ├── pdf-lib.min.js      # PDF oluşturma
    ├── fontkit.umd.js
    ├── fuel-slip-blank.pdf # PDF şablonu
    ├── pdf_field_map.json
    ├── airbus.svg
    ├── boeing.svg
    ├── logo-192.png
    └── logo-512.png
```

## 🛠️ Teknolojiler

- **HTML5 / CSS3 / JavaScript** (Vanilla, framework yok)
- **PWA** — Service Worker + Web App Manifest
- **pdf-lib** — PDF oluşturma
- **LocalStorage** — Kayıt saklama

## ⚠️ Uyarı

Bu uygulama **referans amaçlıdır**. Gerçek yakıt ikmali işlemlerinde her zaman:
- **AMM/FCOM/Operatör prosedürlerini** takip edin
- **Panel/placard limitlerini** kontrol edin
- **Yetkili personel onayı** alın

## 📝 Sürüm Geçmişi

### v7.6.0 (07.06.2026) - Towing Assist eklendi ve Sürüm 7.6.0 yayını
- 🚜 **Towing Assist:** Uçak çekim operasyonları için checklist ve zaman kayıt modülü eklendi.
- 📖 **Kullanım Kılavuzu:** Uygulama içi kılavuz yeni özellikleri içerecek şekilde güncellendi.
- 🔄 **Sürüm Güncellemesi:** Tüm bileşenler v7.6.0 sürümüne yükseltildi.

### v7.5.0 (06.06.2026) - Blok Saat ve Motor Çalıştırma güncellemeleri, Sürüm 7.5.0 yayını
- 🚀 Blok Saat Hesaplayıcı ve Motor Testi modülleri güncellendi, yeni kontroller eklendi
- 🔄 Tüm uygulama genelinde sürüm numaraları v7.5.0'a yükseltildi ve senkronize edildi
- 📦 Service Worker ve manifest.json üretim ortamı için hazır hale getirildi ve yayınlandı

### v7.4.12 (06.06.2026) - Sürüm güncellemeleri yapıldı ve yayına hazır hale getirildi

### v7.4.7 (Nisan 2026)
- 🐛 HTML yapısı düzeltmeleri
- 🐛 Service Worker cache listesi güncellendi
- 🐛 Duplicate JSON kayıtları temizlendi
- ✨ PWA manifest iyileştirmeleri
- 📦 GitHub yayın hazırlığı

### v7.4.3
- İlk kararlı sürüm

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<p align="center">
  Made with ✈️ for flight operations
</p>
