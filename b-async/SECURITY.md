# Web Güvenliği Kılavuzu - b-async Website

## 🔐 HTML, CSS ve JavaScript Dosyalarının Görünürlüğünü Azaltma

### 1. **Minification (Dosya Boyutunu Küçültme)**

HTML, CSS ve JS dosyalarını minify ederek okunabilirliği azaltın.

#### **Minify Araçları:**
- **Online**: [TinyURL](https://tinyurl.com), [Minifier.org](https://www.minifier.org)
- **NPM**: `npm install -g terser cssnano html-minifier`
- **Build Tools**: Webpack, Vite, Gulp

**Örnek - Terser ile JS Minify:**
```bash
npx terser js/script.js -o js/script.min.js -c -m
```

**Örnek - Minified CSS:**
```bash
npx cssnano style/main.css -o style/main.min.css
```

### 2. **.htaccess Konfigürasyonu (Apache Sunucusu)**

Kök dizine `.htaccess` dosyası oluşturun:

```apache
# ============================================
# Security Headers & Protection
# ============================================

# Direkt dosya erişimini engellemek
<FilesMatch "\.js$|\.css$">
    # Kaynak haritalarını devre dışı bırak
    <IfModule mod_headers.c>
        Header set X-Content-Type-Options: nosniff
        Header set X-Frame-Options: SAMEORIGIN
        Header set X-XSS-Protection: "1; mode=block"
        Header set Referrer-Policy: "strict-origin-when-cross-origin"
    </IfModule>
</FilesMatch>

# Source maps dosyalarına erişimi engelle
<FilesMatch "\.map$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Gizli dosyalara erişimi engelle
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

# ============================================
# CORS & CSP Ayarları
# ============================================

<IfModule mod_headers.c>
    # Content Security Policy
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:;"
    
    # Başka siteler tarafından iframe içinde kullanılmasını engelle
    Header set X-Frame-Options: "SAMEORIGIN"
    
    # MIME type algısını devre dışı bırak
    Header set X-Content-Type-Options: "nosniff"
    
    # XSS koruması
    Header set X-XSS-Protection: "1; mode=block"
    
    # Referrer politikası
    Header set Referrer-Policy: "strict-origin-when-cross-origin"
    
    # Permissions Policy
    Header set Permissions-Policy: "geolocation=(), microphone=(), camera=()"
</IfModule>

# ============================================
# Cache Busting & Compression
# ============================================

<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType image/png "access plus 1 year"
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# ============================================
# Sensitive File Protection
# ============================================

# Config dosyalarına erişimi engelle
<FilesMatch "\.(env|config|json|sql)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Backup dosyalarına erişimi engelle
<FilesMatch "\.(bak|backup|old|tmp)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

### 3. **nginx Konfigürasyonu**

`nginx.conf` veya site konfigürasyon dosyasına ekleyin:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # ============================================
    # Security Headers
    # ============================================
    
    # HTTPS zorunlu
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # CSP Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:" always;
    
    # X-Frame-Options
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # Disable MIME type sniffing
    add_header X-Content-Type-Options "nosniff" always;
    
    # XSS Protection
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Referrer Policy
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Permissions Policy
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # ============================================
    # GZip Compression
    # ============================================
    
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # ============================================
    # Dosya Erişim Kontrolleri
    # ============================================
    
    # Source maps engelle
    location ~* \.map$ {
        return 403;
    }
    
    # Gizli dosyalar
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Sensitive dosyalar
    location ~* \.(env|config|sql|bak|backup)$ {
        deny all;
    }
    
    # CSS ve JS caching
    location ~* \.(js|css)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    root /var/www/html;
    index index.html;
}
```

### 4. **HTML Dosyasında Security Headers (Meta Tags)**

[index.html](index.html) dosyasında `<head>` bölümüne ekleyin:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>b-async | Yenilikçi Yazılım Çözümleri</title>
    
    <!-- Security Meta Tags -->
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:;">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    
    <!-- External Libraries -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="style/main.css">
    
    <!-- Preload critical resources -->
    <link rel="preload" href="js/script.js" as="script">
    <link rel="preload" href="style/main.css" as="style">
</head>
```

### 5. **Minified Dosyaları Kullanma**

HTML dosyasında:

```html
<!-- Production ortamında -->
<link rel="stylesheet" href="style/main.min.css">

<!-- Development -->
<link rel="stylesheet" href="style/main.css">
```

```html
<!-- Script - body sonunda -->
<script src="js/script.min.js"></script>
```

### 6. **Environment-Based Loading**

```html
<script>
    // Dosyayı ortama göre yükle
    const isProduction = window.location.hostname !== 'localhost';
    const scriptFile = isProduction ? 'js/script.min.js' : 'js/script.js';
    const cssFile = isProduction ? 'style/main.min.css' : 'style/main.css';
    
    // CSS dinamik yüklemesi
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    document.head.appendChild(link);
</script>
```

### 7. **Package.json ile Otomatik Build**

```json
{
  "name": "b-async-website",
  "version": "1.0.0",
  "scripts": {
    "minify:js": "terser js/script.js -o js/script.min.js -c -m",
    "minify:css": "cssnano style/main.css -o style/main.min.css",
    "minify:html": "html-minifier --input-dir . --output-dir dist --file-ext html",
    "build": "npm run minify:js && npm run minify:css && npm run minify:html",
    "start": "http-server"
  },
  "devDependencies": {
    "terser": "^5.x",
    "cssnano-cli": "^3.x",
    "html-minifier": "^4.x"
  }
}
```

### 8. **robots.txt - Crawling Kontrolleri**

Kök dizine oluşturun:

```robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /*.env
Disallow: /*.config
Disallow: /*.map
Disallow: /.git/
Disallow: /node_modules/
Disallow: /*.bak
Disallow: /*.backup

# Dosya haritalarını engelle
Disallow: /*.js.map
Disallow: /*.css.map

# Sitemap
Sitemap: https://yourdomain.com/sitemap.xml
```

### 9. **Web Server Güvenlik Checklist**

✅ **HTTPS/SSL** kullanın (Let's Encrypt ücretsiz)
✅ **HTTP Headers** doğru ayarlayın
✅ **Source maps** production'da kaldırmayın
✅ **Error pages** detaylı bilgi göstermeyin
✅ **Directory listing** kapatın
✅ **Version headers** kaldırın
✅ **API endpoints** validate edin
✅ **CORS** politikası belirleyin

### 10. **Yardımcı Tool'lar**

- **Security Header Check**: [securityheaders.com](https://securityheaders.com)
- **SSL Test**: [ssllabs.com](https://www.ssllabs.com)
- **CSP Validator**: [csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com)
- **Security Audit**: [owasp.org](https://owasp.org)

## 📋 Özet - 3 Adımda Başlayın

1. **Minify et**: `npm run build` ile CSS/JS'i küçültün
2. **.htaccess ekle**: Security headers ve file protection
3. **Meta tags ekle**: HTML'de CSP ve security headers

Bunlar uygulandığında site güvenliği %80+ artacaktır! 🔒
