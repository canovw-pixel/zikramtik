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
- [x] WooCommerce compatible REST API (v2 + v3)
- [x] GIB e-Arsiv Portal integration - auto invoice on payment
- [x] Invoice email to customer on payment
- [x] Kargonomi WooCommerce entegrasyonu - BASARILI
- [x] Yengec e-Fatura/e-Arsiv entegrasyonu - BASARILI (2026-04-29)
- [x] Nginx proxy: /wp-json/, /wc-auth/, /wp-admin/, /api/
- [x] Backend systemd service (zikra-backend)
- [x] SMTP DNS fix - mail.zikramatik.com A record added via cPanel (2026-05-13)
- [x] SMTP fallback - uses direct IP 45.84.189.83 if hostname DNS fails (email.py auto-detects)
- [x] Order cancellation flow with PayTR refund + cancellation email
- [x] **Kupon / Indirim Kodu Sistemi (2026-05-13)** - percent/fixed types, min_order_amount, max_discount cap, usage_limit, valid_until, active flag, used_count auto-increment. Admin CRUD UI at /admin (Kuponlar tab). Checkout integration with apply/remove + discount display. 20/20 backend pytest passing.

## Key Technical Achievement
- Reverse-engineered Yengec WordPress plugin (from SVN repo)
- Discovered auth-callback mechanism: plugin creates keys and redirects to app.yengec.co/auth-callback/woocommerce with query params
- Implemented full WooCommerce v2+v3 API compatibility for non-WordPress site

## Pending
- [ ] P1: Dusuk Stok Uyarilari (admin email + low stock filtre)
- [ ] P1: SEO Optimizasyonu (meta tags, sitemap.xml, Open Graph, JSON-LD)
- [ ] P1: Kargonomi Bearer Token (webhook icin, WhatsApp destekten alinacak)
- [ ] P2: ShipEntegra API entegrasyonu (yurt disi kargo)
- [ ] P2: Admin panelde fatura goruntuleme
- [ ] P2: Yengec manuel API key girisi (destekle iletisim)

## Key Credentials
- GIB Portal: 24205166 / 664499
- WC API: ck_aa013c45c767e5594b81a3500255b1992cb95c60 / cs_993be2214a7043124c94392169048cdb97b105f3
- PayTR: Merchant ID 694137
- VPS: 89.252.185.130 (root)
- Admin: admin@zikra.com / admin123

## VPS Deployment Notes
- Server: 89.252.185.130 (Guzelhosting)
- Project: /var/www/zikra
- Backend: systemd service (systemctl restart zikra-backend)
- Nginx: /etc/nginx/sites-enabled/zikra
- Apache must be disabled
