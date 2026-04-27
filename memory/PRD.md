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
- [x] WooCommerce compatible REST API for Yengec
- [x] GIB e-Arsiv Portal integration - auto invoice on shipment - 2026-04-27
- [x] Invoice email to customer on shipment - 2026-04-27

## Pending
- [ ] P0: Deploy GIB e-Arsiv to VPS (earsivportal + pytz pip install)
- [ ] P1: BasitKargo API Integration (needs API token)
- [ ] P1: Yengec manual connection (contact support for manual API binding)
- [ ] P2: ShipEntegra API Integration

## Key Credentials (.env)
- GIB_PORTAL_USER, GIB_PORTAL_PASS (e-Arsiv Portal login)
- WC_CONSUMER_KEY, WC_CONSUMER_SECRET (Yengec WooCommerce API)
- PAYTR_MERCHANT_ID/KEY/SALT (PayTR payment)

## VPS Deployment Notes
- Server: 89.252.185.130
- Nginx: /etc/nginx/sites-enabled/zikra (proxy /wp-json/, /wc-auth/, /wp-admin/, /api/)
- Backend: uvicorn --workers 1 on port 8001
- Apache must be disabled
- VPS needs: pip install earsivportal pytz in venv
