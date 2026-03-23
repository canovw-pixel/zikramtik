# Craponia Atelier - Zikra Zikirmatik E-Commerce

## Problem Statement
Build an e-commerce website for "Craponia Atelier" brand selling "Zikra" zikirmatik products. Minimal, luxurious design with burgundy theme. Clone of reiskuyumculuk.com.

## Live Site
- **Domain:** https://zikramatik.com
- **Admin:** https://zikramatik.com/admin/login (admin@zikra.com / admin123)
- **VPS:** 89.252.185.130 (Guzelhosting TR-VPS-2, Ubuntu 22.04, 1 GB RAM)

## Company Info
- **Firma:** Craponia Mücevherat ve Hediyelik Eşya
- **Adres:** Alemdar Mahallesi Hacı Tahsin Bey Sokak Dr. Hacı Tahsin Bey İş Hanı No:5/7 Fatih/İstanbul
- **Telefon:** +90 553 076 60 00
- **E-posta:** info@zikramatik.com

## Tech Stack
- **Frontend:** React, TailwindCSS, react-router-dom, Context API, react-barcode
- **Backend:** FastAPI, MongoDB (motor), JWT auth
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
- [x] Mock email notification on shipping
- [x] VPS deployment completed - site live at zikramatik.com
- [x] SSL certificate (Let's Encrypt) installed
- [x] Localized Price Formatting (e.g., 1.250,00)
- [x] Auto IP-based Geolocation (ip-api.com)
- [x] Source Serif 4 font for featured section title
- [x] **iyzico Criteria Pages (2026-03-23):**
  - [x] Hakkımızda sayfası (/hakkimizda)
  - [x] Teslimat ve İade Şartları (/teslimat-iade)
  - [x] Gizlilik Sözleşmesi (/gizlilik) - KVKK uyumlu
  - [x] Mesafeli Satış Sözleşmesi (/mesafeli-satis)
  - [x] Visa ve MasterCard logoları (footer)
  - [x] iyzico ile Öde logosu (footer)
  - [x] Updated header/footer navigation with proper Turkish characters

## Backlog (Prioritized)
### P0
- iyzico payment gateway integration (waiting for API keys from iyzico approval)

### P1
- Admin category management UI
- Real email notification service (SendGrid/Resend)
- Real cargo API integration

### P2
- Customer account system & order history

## Mocked Systems
- **Payment:** Mock - orders created with status "pending"
- **Email:** Mock - shipping notifications logged to console
- **Cargo barcode:** Generated from manually entered tracking number
