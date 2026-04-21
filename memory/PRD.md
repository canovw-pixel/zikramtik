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
- Yurtiçi Kargo & ShipEntegra integrations (Pending)

## Tech Stack
- Frontend: React, TailwindCSS, React Router
- Backend: FastAPI, MongoDB (motor async), httpx
- Payments: PayTR iFrame API with HMAC SHA256, all charges in TL
- Currency: open.er-api.com (free, cached 1hr)
- Emails: Python smtplib + email.mime
- Font: Source Serif 4

## Architecture
```
/app
├── backend
│   ├── models/ (category.py, order.py, product.py, user.py)
│   ├── routes/ (auth.py, categories.py, orders.py, products.py, upload.py, payment.py)
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
- [x] PayTR iFrame payment integration - LIVE MODE (switched from test) - 2026-04-21
- [x] Real-time currency conversion to TL for all payments (open.er-api.com) - 2026-04-21
- [x] SMTP email notifications (info@zikramatik.com)
- [x] Legal pages (Hakkimizda, Teslimat/Iade, Gizlilik, Mesafeli Satis)
- [x] Source Serif 4 custom typography
- [x] Scroll-to-top on navigation
- [x] Footer with real payment logos (Mastercard, Troy, PayTR PNGs) - 2026-04-21
- [x] PayTR iFrameResizer script integration
- [x] No installment (tek cekim) payment mode
- [x] Checkout shows TL equivalent for foreign currency orders
- [x] Emergent watermark/badge removed from production build - 2026-04-21
- [x] VPS deployment: server.py fixed (load_dotenv before imports, payment route added)
- [x] VPS deployment: .env updated with PayTR credentials
- [x] VPS deployment: Apache disabled, Nginx enabled

## Pending / Backlog
- [ ] P1: Yurtici Kargo API Integration (needs API credentials from user)
- [ ] P1: ShipEntegra API Integration (needs API key from user)

## Key API Endpoints
- POST /api/payment/get-token - PayTR iFrame token generation (auto TL conversion)
- POST /api/payment/callback - PayTR webhook (Bildirim URL)
- GET /api/payment/status/{order_id} - Payment status check
- GET /api/payment/convert-to-tl?amount=X&currency=Y - Currency conversion endpoint

## VPS Deployment Notes
- Server: 89.252.185.130 (Guzelhosting)
- Project path: /var/www/zikra
- Backend: uvicorn with --workers 1 on port 8001
- Frontend: yarn build, served by Nginx
- Important: Apache must be disabled (systemctl disable apache2)
- Important: server.py must load_dotenv BEFORE importing routes
- Important: PayTR Bildirim URL set to https://zikramatik.com/api/payment/callback

## Known Limitations
- Preview environment cannot send emails (DNS restriction on port 465/587) - works on VPS
- Exchange rates cached for 1 hour (open.er-api.com free tier)
