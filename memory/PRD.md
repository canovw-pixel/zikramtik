# Zikra E-Commerce - Product Requirements Document

## Original Problem Statement
E-commerce website for "zikirmatik" product (Brand: Craponia Atelier, Model: Zikra). Minimal/luxurious design with burgundy theme, global sales with auto IP-based country detection for pricing, payment gateway, email notifications, cargo API and invoice integration.

## What's Been Implemented
- [x] Full e-commerce UI with burgundy theme
- [x] Admin panel (products, categories, orders CRUD)
- [x] Multi-image product uploads
- [x] IP-based geolocation pricing
- [x] PayTR iFrame payment (LIVE MODE)
- [x] Real-time currency conversion to TL (open.er-api.com)
- [x] SMTP email notifications (info@zikramatik.com)
- [x] Legal pages, Source Serif 4 font
- [x] Footer with real payment logos (Mastercard, Troy, PayTR)
- [x] WooCommerce compatible REST API (Yengec entegrasyonu icin)
- [x] GIB e-Arsiv Portal integration - auto invoice on shipment
- [x] Invoice email to customer on shipment
- [x] Nginx proxy: /wp-json/, /wc-auth/, /wp-admin/, /api/
- [x] Emergent watermark removed

## Pending / Tomorrow's Tasks
- [ ] P0: BasitKargo API entegrasyonu (API token bekleniyor)
- [ ] P0: Admin panelde "Kargola" butonu + kargo firmasi secimi (varsayilan: Aras Kargo)
- [ ] P1: Yengec destek hatti ile manuel WooCommerce API baglantisi
- [ ] P2: ShipEntegra API entegrasyonu (yurt disi kargo)
- [ ] P2: Admin panelde fatura goruntuleme / durum takibi

## Key Credentials
- GIB Portal: 24205166 / 664499
- WC API: ck_aa013c45c767e5594b81a3500255b1992cb95c60 / cs_993be2214a7043124c94392169048cdb97b105f3
- PayTR: Merchant ID 694137
- VPS: 89.252.185.130 (root)
- Admin: admin@zikra.com / admin123

## VPS Deployment Notes
- Server: 89.252.185.130 (Guzelhosting)
- Project: /var/www/zikra
- Backend: uvicorn --workers 1 on port 8001
- Nginx: /etc/nginx/sites-enabled/zikra
- Apache must be disabled (systemctl stop apache2)
- Backend venv needs: earsivportal, pytz, httpx
