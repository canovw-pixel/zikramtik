# Craponia Atelier - Zikra Zikirmatik E-Commerce

## Problem Statement
Build an e-commerce website clone of `reiskuyumculuk.com` for "Craponia Atelier" brand selling "Zikra" zikirmatik (digital prayer bead ring) and other products. Minimal, luxurious design with burgundy theme. Global sales with multi-currency, admin panel, and iyzico payment (pending).

## User Personas
- **Customers:** Browse products, add to cart, checkout with shipping info, track orders
- **Admin:** Manage products (CRUD, images, pricing, featured toggle), manage orders (view, ship, deliver, cancel)

## Core Requirements
- Burgundy/luxury theme, responsive design
- Product CRUD with multi-image upload, featuring system
- Country-specific pricing with auto-detection
- Shopping cart with localStorage persistence
- Checkout flow with mock payment
- Admin panel (auth: admin@zikra.com / admin123)
- Order management with shipping/cargo tracking
- Customer order tracking by order number

## Tech Stack
- **Frontend:** React, TailwindCSS, react-router-dom, Context API
- **Backend:** FastAPI, MongoDB (motor), JWT auth
- **Architecture:** RESTful API, /api prefix routing

## What's Been Implemented
- [x] Full frontend UI (homepage, product detail, admin panel)
- [x] Backend API (products CRUD, categories, auth, upload, orders)
- [x] Admin panel with product management
- [x] Multi-image upload from local machine
- [x] Country selector with dynamic pricing
- [x] Shopping cart with CartContext + localStorage (Feb 2026)
- [x] Cart page with quantity controls, remove items (Feb 2026)
- [x] Checkout page with shipping form + customer email (Feb 2026)
- [x] Order confirmation page (Feb 2026)
- [x] Mock order creation via backend API (Feb 2026)
- [x] Admin order management - list, stats, filters, detail view (Feb 2026)
- [x] Admin shipping modal - cargo company + tracking number (Feb 2026)
- [x] Auto status change to "shipped" when tracking number added (Feb 2026)
- [x] Mock email notification on shipping (Feb 2026)
- [x] Customer order tracking page /order-tracking (Feb 2026)
- [x] Order progress steps visualization (Feb 2026)
- [x] Header navigation with "Siparis Takibi" link (Feb 2026)

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
- **products:** {id, name, description, category_id, images[], prices: {country: {price}}, stock, is_featured}
- **orders:** {id, order_number, products[], country, shipping_address, billing_address, customer_email, total_amount, currency, status, payment_status, tracking_number, cargo_company, shipped_at}

## Backlog (Prioritized)
### P0
- iyzico payment gateway integration (waiting for API keys)

### P1
- Admin category management UI
- Real email notification service (SendGrid/Resend integration)

### P2
- Customer account system
- Order history for customers
- Email notifications for order status changes (not just shipping)

## Mocked Systems
- **Payment:** Orders created with status "pending", no real payment processing
- **Email:** Shipping notifications logged to console, not actually sent
