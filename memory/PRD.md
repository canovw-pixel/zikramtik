# Zikra E-Commerce - Product Requirements Document

## Original Problem Statement
E-commerce website clone of reiskuyumculuk.com for "zikirmatik" product (Brand: Craponia Atelier, Model: Zikra). Minimal/luxurious design with burgundy theme, global sales with auto IP-based country detection for pricing, payment gateway integration, email notifications, and cargo API integration.

## Core Requirements
- Minimalist, elegant UI with burgundy theme
- Admin panel for products, categories, and orders
- Multi-image uploads and featured products
- Global pricing (auto IP detection via ip-api.com)
- PayTR Payment Gateway (iFrame API) with real-time currency conversion to TL
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
- [x] PayTR iFrame payment integration (test mode) - Fixed 2026-04-21
- [x] Real-time currency conversion to TL for all payments - Added 2026-04-21
- [x] SMTP email notifications (info@zikramatik.com)
- [x] Legal pages (Hakkımızda, Teslimat/İade, Gizlilik, Mesafeli Satış)
- [x] Source Serif 4 custom typography
- [x] Scroll-to-top on navigation
- [x] Footer with real payment logos (Mastercard, Troy, PayTR PNGs) - Updated 2026-04-21
- [x] PayTR iFrameResizer script integration
- [x] No installment (tek çekim) payment mode
- [x] Checkout shows TL equivalent for foreign currency orders

## Pending / Backlog
- [ ] P1: Yurtiçi Kargo API Integration (needs API credentials from user)
- [ ] P1: ShipEntegra API Integration (needs API key from user)

## Key API Endpoints
- POST /api/payment/get-token - PayTR iFrame token generation (auto TL conversion)
- POST /api/payment/callback - PayTR webhook (Bildirim URL)
- GET /api/payment/status/{order_id} - Payment status check
- GET /api/payment/convert-to-tl?amount=X&currency=Y - Currency conversion endpoint

## Known Limitations
- Preview environment cannot send emails (DNS restriction on port 465/587) - works on user's VPS
- PayTR currently in test mode (PAYTR_TEST_MODE=1)
- Exchange rates cached for 1 hour (open.er-api.com free tier)

## Deployment
User's VPS at zikramatik.com. Deploy via "Save to Github" then SSH commands on server.
