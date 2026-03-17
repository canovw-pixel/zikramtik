# Craponia Atelier - Zikra Zikirmatik E-Commerce

## Problem Statement
Build an e-commerce website clone of `reiskuyumculuk.com` for "Craponia Atelier" brand selling "Zikra" zikirmatik (digital prayer bead ring) and other products. Minimal, luxurious design with burgundy theme. Global sales with multi-currency, admin panel, and iyzico payment (pending).

## User Personas
- **Customers:** Browse products, add to cart, checkout with shipping info, track orders
- **Admin:** Manage products (CRUD, images, pricing, featured toggle), manage orders (view, ship with barcode label, deliver, cancel)

## Tech Stack
- **Frontend:** React, TailwindCSS, react-router-dom, Context API, react-barcode
- **Backend:** FastAPI, MongoDB (motor), JWT auth

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
- [x] Mock order creation via backend API
- [x] Admin order management - list, stats, filters, detail view
- [x] Admin shipping modal - cargo company + tracking number (auto-sets shipped)
- [x] Mock email notification on shipping
- [x] Customer order tracking page /order-tracking with progress steps
- [x] Cargo tracking URL links to company websites (Yurtici, Aras, MNG, PTT, UPS, DHL, FedEx)
- [x] Printable shipping label with barcode (react-barcode)

## API Endpoints
- `POST /api/auth/login` - Admin login
- `GET/POST /api/products` - Product listing/creation
- `GET/PUT/DELETE /api/products/:id` - Product CRUD
- `GET/POST /api/categories` - Categories
- `POST /api/upload/images` - Image upload
- `POST /api/orders` - Create order (MOCK payment)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - List orders (admin, with pagination)
- `GET /api/orders/stats/summary` - Order stats (admin)
- `GET /api/orders/track/:order_number` - Public order tracking
- `PUT /api/orders/:id/status` - Update order status (admin)
- `PUT /api/orders/:id/shipping` - Add tracking number + auto ship (admin)

## DB Schema
- **users:** {email, password_hash}
- **products:** {id, name, description, category_id, images[], prices, stock, is_featured}
- **orders:** {id, order_number, products[], country, shipping_address, billing_address, customer_email, total_amount, currency, status, payment_status, tracking_number, cargo_company, shipped_at}

## Backlog (Prioritized)
### P0
- iyzico payment gateway integration (waiting for API keys)

### P1
- Admin category management UI
- Real email notification service (SendGrid/Resend)
- Real cargo API integration (auto tracking number)

### P2
- Customer account system & order history

## Mocked Systems
- **Payment:** Orders created with status "pending", no real payment processing
- **Email:** Shipping notifications logged to console, not actually sent
- **Cargo barcode:** Generated from manually entered tracking number, not from cargo company API

## Credentials
- Admin: admin@zikra.com / admin123
