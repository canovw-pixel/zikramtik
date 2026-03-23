# Craponia Atelier - Zikra Zikirmatik E-Commerce

## Problem Statement
Build an e-commerce website for "Craponia Atelier" brand selling "Zikra" zikirmatik products. Minimal, luxurious design with burgundy theme. Clone of reiskuyumculuk.com.

## Live Site
- **Domain:** https://zikramatik.com
- **Admin:** https://zikramatik.com/admin/login (admin@zikra.com / admin123)
- **VPS:** 89.252.185.130 (Guzelhosting TR-VPS-2, Ubuntu 22.04, 1 GB RAM)

## Company Info
- **Firma:** Craponia Mucevherat ve Hediyelik Esya
- **Adres:** Alemdar Mahallesi Haci Tahsin Bey Sokak Dr. Haci Tahsin Bey Is Hani No:5/7 Fatih/Istanbul
- **Telefon:** +90 553 076 60 00
- **E-posta:** info@zikramatik.com

## Tech Stack
- **Frontend:** React, TailwindCSS, react-router-dom, Context API, react-barcode
- **Backend:** FastAPI, MongoDB (motor), JWT auth, SMTP email
- **Deployment:** Ubuntu 22.04 VPS, Nginx, Systemd, Let's Encrypt SSL

## What's Been Implemented
- [x] Full frontend UI (homepage, product detail, admin panel)
- [x] Backend API (products CRUD, categories, auth, upload, orders)
- [x] Admin panel with product management + order management
- [x] Multi-image upload from local machine
- [x] Country selector with dynamic pricing
- [x] Shopping cart with CartContext + localStorage
- [x] Checkout page with shipping form + customer email
- [x] Admin order management - list, stats, filters, detail view
- [x] Admin shipping modal - auto status change to "shipped"
- [x] Cargo tracking URL links (Yurtici, Aras, MNG, PTT, UPS, DHL, FedEx)
- [x] Printable shipping label with barcode
- [x] Customer order tracking page /order-tracking
- [x] VPS deployment completed - site live at zikramatik.com
- [x] SSL certificate (Let's Encrypt) installed
- [x] Localized Price Formatting (e.g., 1.250,00)
- [x] Auto IP-based Geolocation (ip-api.com)
- [x] Source Serif 4 font across all pages (replaced Cinzel)
- [x] iyzico Criteria Pages (2026-03-23):
  - Hakkimizda sayfasi (/hakkimizda)
  - Teslimat ve Iade Sartlari (/teslimat-iade)
  - Gizlilik Sozlesmesi (/gizlilik) - KVKK uyumlu
  - Mesafeli Satis Sozlesmesi (/mesafeli-satis)
  - Visa ve MasterCard logolari (footer)
  - iyzico ile Ode logosu (footer)
- [x] Updated header/footer navigation with scroll-to-top fix
- [x] SMTP Email Integration (2026-03-23):
  - Siparis onay e-postasi (musteri siparis verince otomatik)
  - Kargo bildirim e-postasi (admin kargo bilgisi girince otomatik)
  - Turkce, markali HTML sablon (Craponia Atelier temasi)
  - SMTP: mail.zikramatik.com:465 SSL

## Backlog (Prioritized)
### P0 - Next Session
- Yurtici Kargo API entegrasyonu (yurtici siparisler) - API bilgileri bekleniyor
- ShipEntegra API entegrasyonu (yurtdisi siparisler) - API key bekleniyor
- Siparis durum guncelleme e-postalari (kargoda, dagitimda, teslim edildi)
- Teslimat durumunda otomatik e-posta bildirimi

### P1
- iyzico odeme entegrasyonu (iyzico basvuru onayi bekleniyor)

### P2
- Admin kategori yonetimi UI
- Musteri hesap sistemi ve siparis gecmisi

## Credentials
- **Admin:** admin@zikra.com / admin123
- **SMTP:** mail.zikramatik.com:465 / info@zikramatik.com / Desert56.
- **Github Repo:** https://github.com/canovw-pixel/zikramtik.git

## VPS Deploy Commands
```bash
# Build
cd /var/www/zikra && git clone https://github.com/canovw-pixel/zikramtik.git tempX && cp -r tempX/frontend/src/* frontend/src/ && cp -r tempX/frontend/public/images frontend/public/ && cp -r tempX/backend/utils/* backend/utils/ && cp -r tempX/backend/routes/* backend/routes/ && rm -rf tempX && cd frontend && yarn build

# Badge remove
cd /var/www/zikra/frontend/build && python3 -c "
html = open('index.html','r').read()
start = html.find('<a')
while start != -1:
    if 'emergent-badge' in html[start:start+200]:
        end = html.find('</a>', start) + 4
        html = html[:start] + html[end:]
        break
    start = html.find('<a', start+1)
open('index.html','w').write(html)
print('Badge removed successfully')
"

# Backend restart (only if backend files changed)
sudo systemctl restart zikra-backend
```

## Mocked Systems
- **Payment:** Mock - orders created with status "pending" (iyzico entegrasyonu beklemede)
