# Zikra E-Commerce - Product Requirements Document

## Original Problem Statement
E-commerce website for "zikirmatik" product (Brand: Craponia Atelier, Model: Zikra).

## What's Been Implemented
- [x] Full e-commerce UI with burgundy theme
- [x] Admin panel (products, categories, orders CRUD)
- [x] Multi-image product uploads
- [x] IP-based geolocation pricing
- [x] PayTR iFrame payment (LIVE MODE)
- [x] Real-time currency conversion to TL
- [x] SMTP email notifications
- [x] Legal pages, Source Serif 4 font
- [x] Footer with real payment logos
- [x] WooCommerce compatible REST API
- [x] GIB e-Arsiv Portal integration - auto invoice on shipment
- [x] Invoice email to customer on shipment
- [x] Kargonomi WooCommerce entegrasyonu - BASARILI (2026-04-27)
- [x] Nginx proxy: /wp-json/, /wc-auth/, /wp-admin/, /api/

## Pending
- [ ] P1: Yengec destek hatti ile manuel API baglantisi (mesai saatlerinde)
- [ ] P2: ShipEntegra API entegrasyonu (yurt disi kargo)
- [ ] P2: Admin panelde fatura goruntuleme / durum takibi

## Key Credentials
- GIB Portal: 24205166 / 664499
- WC API: ck_aa013c45c767e5594b81a3500255b1992cb95c60 / cs_993be2214a7043124c94392169048cdb97b105f3
- PayTR: Merchant ID 694137
- VPS: 89.252.185.130 (root)
- Admin: admin@zikra.com / admin123
- Kargonomi: Ramazan Celtikli / XRTUFU92

## VPS Deployment Notes
- Server: 89.252.185.130 (Guzelhosting)
- Project: /var/www/zikra
- Backend: uvicorn --workers 1 on port 8001
- Nginx: /etc/nginx/sites-enabled/zikra
- Apache must be disabled
- VPS needs: earsivportal, pytz, httpx in venv
