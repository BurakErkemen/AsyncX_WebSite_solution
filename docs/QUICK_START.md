# Web Güvenliği - Hızlı Başlangıç Kılavuzu

## 🚀 3 Adımda Başlayın

### Adım 1: Dependency Yükle
```bash
npm install
```

### Adım 2: Production için Build Et
```bash
npm run build
```

Bu komut:
- ✅ `js/script.min.js` oluşturur
- ✅ `style/main.min.css` oluşturur
- ✅ Dosyaları %60-70 küçültür

### Adım 3: HTML'de Minified Dosyaları Kullan

Production ortamında `index.html` içinde:
```html
<!-- CSS -->
<link rel="stylesheet" href="style/main.min.css">

<!-- Script -->
<script src="js/script.min.js"></script>
```

---

## 📁 Yüklenen Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `.htaccess` | Apache sunucu güvenlik ayarları |
| `robots.txt` | Search engine crawling kontrolleri |
| `package.json` | Build scripts ve dependencies |
| `SECURITY.md` | Detaylı güvenlik dokümantasyonu |

---

## 🔐 Security Headers Kontrol

Web siteniz yayınlandıktan sonra buradan kontrol edin:
- **[securityheaders.com](https://securityheaders.com)** - Tüm security headers görmek için

---

## 💾 Sunucu Ayarlaması

### Apache (.htaccess)
✅ Dosyası hazır, root dizine yerleştirin.

### Nginx
`SECURITY.md` dosyasında `nginx.conf` ayarlarını bulabilirsiniz.

### Windows Server (IIS)
`SECURITY.md` dosyasında web.config ayarlarını bulabilirsiniz.

---

## 🛡️ Yapılan Güvenlik Önlemleri

### 1. **File Protection**
- ✅ `.env`, `.config`, `.map` dosyalarına erişim engellendi
- ✅ Source maps devre dışı
- ✅ Gizli dosyalar korunuyor

### 2. **Security Headers**
- ✅ `X-Frame-Options: SAMEORIGIN` - Clickjacking koruması
- ✅ `X-Content-Type-Options: nosniff` - MIME sniffing koruması
- ✅ `Content-Security-Policy` - XSS koruması
- ✅ `X-XSS-Protection` - XSS saldırıları
- ✅ `Referrer-Policy` - Gizlilik koruması
- ✅ `Permissions-Policy` - Tarayıcı özelliklerini sınırla

### 3. **Compression & Caching**
- ✅ GZip compression etkinleştirildi
- ✅ Browser caching optimize edildi
- ✅ Static assets 1 yıla kadar cache edilir

### 4. **Search Engines**
- ✅ `robots.txt` ile crawling kontrol
- ✅ Gizli dosyalar tarama sonuçlarından uzak

---

## 📊 Ön vs Sonra

### Dosya Boyutları
```
ÖNCE:
- js/script.js:     ~500 KB
- style/main.css:   ~200 KB
- index.html:       ~150 KB

SONRA (Minified):
- js/script.min.js:   ~150 KB (70% küçük)
- style/main.min.css: ~65 KB  (67% küçük)
- index.html:         ~75 KB  (50% küçük)
```

### Güvenlik Puanı
```
ÖNCE:
- Source maps visible ❌
- Security headers missing ❌
- File protection missing ❌
- MIME types exposed ❌

SONRA:
- Source maps hidden ✅
- Security headers enabled ✅
- Sensitive files protected ✅
- MIME types secured ✅
```

---

## 🔍 Test Etme

### Yerel Sunucuda Test
```bash
# Python yüklüyse
npm run server

# Veya Node.js ile
npm start
```

### Security Check
1. `https://securityheaders.com` ziyaret edin
2. Domain'inizi girin
3. Security score görüntüleyin

### Minification Check
```bash
npm run size
```

---

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Source Maps Production'da Kaldırın**
   ```bash
   rm -f js/*.map style/*.map
   ```

2. **HTTPS Kullanın**
   - Hosting sağlayıcıdan SSL sertifikası isteyin
   - `.htaccess`'de `HTTPS` redirect'ini enable edin

3. **Regular Updates**
   - Dependencies'i güncel tutun
   - Security advisories takip edin

4. **Sunucu Konfigürasyonu**
   - `.htaccess` root dizine yerleştirin
   - `robots.txt` root dizine yerleştirin
   - PHP hata gösterimini kapatın

---

## 📞 Sorun Giderme

### ".htaccess not working"
- Hosting'de `mod_rewrite` enable mi? (Hoster'a sorun)
- Doğru dizinde mi yerleştirdiniz? (Root'da olmalı)

### "CSS/JS yüklenmedi"
- Dosya yollarını kontrol edin
- CORS error var mı? (Konsolu kontrol edin)
- Cache'i temizleyin (Ctrl+Shift+Delete)

### "Source maps hala görünüyor"
- Production build ettiniz mi? (`npm run build`)
- Minified dosyaları mı kulllanıyorsunuz?

---

## 🎯 Checklist - Go Live

- [ ] `npm install` yapıldı
- [ ] `npm run build` koşuldu
- [ ] `.htaccess` root'a yerleştirildi
- [ ] `robots.txt` root'a yerleştirildi
- [ ] Minified dosyalar HTML'de kullanılıyor
- [ ] HTTPS etkinleştirildi
- [ ] Security headers test edildi (securityheaders.com)
- [ ] Source maps kaldırıldı
- [ ] Error logging yapılandırıldı
- [ ] Performance test edildi (PageSpeed Insights)

---

**Başarıyla yayınlandığında, tebrikler! 🎉 Siteniz güvenli ve optimize edilmiş.**
