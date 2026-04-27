# Zikra E-Commerce - Product Requirements Document

## Original Problem Statement
E-commerce website clone of reiskuyumculuk.com for "zikirmatik" product (Brand: Craponia Atelier, Model: Zikra). Minimal/luxurious design with burgundy theme, global sales with auto IP-based country detection for pricing, payment gateway integration, email notifications, and cargo API integration.

## Core Requirements
- Minimalist, elegant UI with burgundy theme
- Admin panel for products, categories, and orders
- Multi-image uploads and featured products
- Global pricing (auto IP detection via ip-api.com)
- PayTR Payment Gateway (iFrame API) with real-time currency conversion to TL - LIVE MODE
- SMTP Email for order/cargo notifications
- Yengec e-Arsiv fatura entegrasyonu (WooCommerce compatible API)
- BasitKargo entegrasyonu (Pending - API token bekleniyor)
- ShipEntegra entegrasyonu (Pending)

## Tech Stack
- Frontend: React, TailwindCSS, React Router
- Backend: FastAPI, MongoDB (motor async), httpx
- Payments: PayTR iFrame API with HMAC SHA256, all charges in TL
- Currency: open.er-api.com (free, cached 1hr)
- Emails: Python smtplib + email.mime
- Font: Source Serif 4
- Yengec Integration: WooCommerce REST API v3 compatible endpoints

## Architecture
```
/app
├── backend
│   ├── models/ (category.py, order.py, product.py, user.py)
│   ├── routes/ (auth.py, categories.py, orders.py, products.py, upload.py, payment.py, woocommerce.py)
│   ├── utils/ (email.py, auth.py, currency.py)
│   ├── database.py
│   └── server.py
├── frontend
│   ├── public/images/ (logos: mastercard.png, paytr.png, troy.png)
│   ├── src
│   │   ├── components/ (Header, Footer, Hero, ProductCard, FeaturedProducts)
│   │   ├── pages/ (Home, Cart, Checkout, OrderTracking, Hakkimizda, PaymentSuccess, PaymentFail)
│   │   ├── services/ (api.js)
│   │   └── App.js
```

## What's Been Implemented
- [x] Full e-commerce UI with burgundy theme
- [x] Admin panel (products, categories, orders CRUD)
- [x] Multi-image product uploads
- [x] IP-based geolocation pricing (ip-api.com)
- [x] PayTR iFrame payment integration - LIVE MODE
- [x] Real-time currency conversion to TL for all payments
- [x] SMTP email notifications (info@zikramatik.com)
- [x] Legal pages
- [x] Source Serif 4 custom typography
- [x] Footer with real payment logos
- [x] Emergent watermark removed
- [x] WooCommerce compatible REST API for Yengec integration - 2026-04-21
  - GET /wp-json/wc/v3/orders (list orders)
  - GET /wp-json/wc/v3/orders/{id} (get order)
  - PUT /wp-json/wc/v3/orders/{id} (update order status)
  - Basic Auth with Consumer Key/Secret

## Pending / In Progress
- [ ] P0: Deploy Yengec WooCommerce API to VPS + Nginx config
- [ ] P1: BasitKargo API Integration (needs API token from user)
- [ ] P2: ShipEntegra API Integration (needs API key from user)

## Key API Endpoints
- POST /api/payment/get-token - PayTR iFrame token generation
- POST /api/payment/callback - PayTR webhook
- GET /api/payment/convert-to-tl - Currency conversion
- GET /wp-json/wc/v3/orders - WooCommerce orders (for Yengec)
- GET /wp-json/wc/v3/orders/{id} - WooCommerce order detail
- PUT /wp-json/wc/v3/orders/{id} - WooCommerce update order

## Yengec Integration Credentials
- Consumer Key: ck_aa013c45c767e5594b81a3500255b1992cb95c60
- Consumer Secret: cs_993be2214a7043124c94392169048cdb97b105f3
- Site URL for Yengec: https://zikramatik.com

## VPS Deployment Notes
- Server: 89.252.185.130 (Guzelhosting)
- Project path: /var/www/zikra
- Backend: uvicorn with --workers 1 on port 8001
- Nginx must proxy /wp-json/ to backend port 8001
- Apache must be disabled
