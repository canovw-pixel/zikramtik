# Craponia Atelier - Zikra Zikirmatik E-Commerce

## Problem Statement
Build an e-commerce website clone of `reiskuyumculuk.com` for "Craponia Atelier" brand selling "Zikra" zikirmatik (digital prayer bead ring) and other products. Minimal, luxurious design with burgundy theme. Global sales with multi-currency, admin panel, and iyzico payment (pending).

## Tech Stack
- **Frontend:** React, TailwindCSS, react-router-dom, Context API, react-barcode
- **Backend:** FastAPI, MongoDB (motor), JWT auth
- **Deployment:** Ubuntu 22.04 VPS (1 GB RAM), Nginx, Systemd, Let's Encrypt SSL

## What's Been Implemented
- [x] Full frontend UI (homepage, product detail, admin panel)
- [x] Backend API (products CRUD, categories, auth, upload, orders)
- [x] Admin panel with product management + order management
- [x] Multi-image upload from local machine
- [x] Country selector with dynamic pricing
- [x] Shopping cart with CartContext + localStorage
- [x] Cart page with quantity controls, remove items
- [x] Checkout page with shipping form + customer email
- [x] Order confirmation page
- [x] Admin order management - list, stats, filters, detail view
- [x] Admin shipping modal - auto status change to "shipped"
- [x] Cargo tracking URL links (Yurtici, Aras, MNG, PTT, UPS, DHL, FedEx)
- [x] Printable shipping label with barcode
- [x] Customer order tracking page /order-tracking
- [x] Mock email notification on shipping
- [x] VPS deployment files (setup, deploy, update scripts + rehber)

## Deployment
- **Hosting:** Guzelhosting TR-VPS-2 (1 GB RAM, Ubuntu 22.04)
- **Method:** Docker'siz, direkt kurulum (Nginx + Systemd)
- **Files:** /app/deploy/ dizininde kurulum scriptleri ve rehber

## Backlog (Prioritized)
### P0
- iyzico payment gateway integration (waiting for API keys)

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

## Credentials
- Admin: admin@zikra.com / admin123
