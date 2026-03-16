# Zikra Zikirmatik - Backend Contracts & Integration Plan

## 1. API Endpoints

### Authentication & Admin
```
POST /api/auth/login
- Body: { email, password }
- Response: { token, user: { id, email, name, role } }

POST /api/auth/register (Admin only)
- Body: { email, password, name }
- Response: { message: "Admin created" }

GET /api/auth/me
- Headers: { Authorization: Bearer <token> }
- Response: { user: { id, email, name, role } }
```

### Products
```
GET /api/products
- Query: ?category=zikirmatik&featured=true
- Response: { products: [...] }

GET /api/products/:id
- Response: { product: {...} }

POST /api/products (Admin only)
- Body: { name, description, category, images[], prices: {}, featured, inStock }
- Response: { product: {...} }

PUT /api/products/:id (Admin only)
- Body: { name, description, category, images[], prices: {}, featured, inStock }
- Response: { product: {...} }

DELETE /api/products/:id (Admin only)
- Response: { message: "Product deleted" }

PUT /api/products/:id/toggle-featured (Admin only)
- Body: { featured: boolean }
- Response: { product: {...} }
- Note: Max 2 featured products allowed
```

### Categories
```
GET /api/categories
- Response: { categories: [...] }

POST /api/categories (Admin only)
- Body: { id, name, description }
- Response: { category: {...} }

PUT /api/categories/:id (Admin only)
- Body: { name, description }
- Response: { category: {...} }

DELETE /api/categories/:id (Admin only)
- Response: { message: "Category deleted" }
```

### Countries & Pricing
```
GET /api/countries
- Response: { countries: [...] }

PUT /api/products/:productId/pricing (Admin only)
- Body: { countryCode: "TR", price: 1299, currency: "TRY" }
- Response: { message: "Pricing updated" }
```

### Orders
```
POST /api/orders
- Body: { products: [{ productId, quantity }], country, shippingAddress, billingAddress }
- Response: { order: {...}, paymentUrl: "iyzico payment link" }

GET /api/orders/:id
- Response: { order: {...} }

GET /api/orders (Admin only)
- Query: ?status=pending&page=1&limit=20
- Response: { orders: [...], total, page, totalPages }

PUT /api/orders/:id/status (Admin only)
- Body: { status: "processing|shipped|delivered|cancelled" }
- Response: { order: {...} }
```

## 2. Database Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum: ['admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  shortName: String,
  description: String,
  category: String (ref to Category),
  categoryName: String,
  images: [String],
  prices: {
    "US": { price: 1299, currency: "USD", symbol: "$" },
    "TR": { price: 45000, currency: "TRY", symbol: "₺" },
    "DE": { price: 1199, currency: "EUR", symbol: "€" },
    // ... all countries
  },
  featured: Boolean (default: false),
  inStock: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  _id: ObjectId,
  id: String (unique slug),
  name: String,
  description: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  products: [{
    productId: ObjectId (ref to Product),
    name: String,
    price: Number,
    currency: String,
    quantity: Number
  }],
  country: {
    code: String,
    name: String,
    currency: String
  },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    // same as shippingAddress
  },
  totalAmount: Number,
  currency: String,
  status: String (enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'success', 'failed']),
  paymentId: String (iyzico payment id),
  createdAt: Date,
  updatedAt: Date
}
```

## 3. Mock Data Migration

### Current Mock Data (frontend/src/data/mock.js)
```javascript
// Replace with actual API calls:
- products array → GET /api/products
- countries array → GET /api/countries
- categories array → GET /api/categories
- heroContent → Can stay as static or move to CMS later
- brandContent → Can stay as static or move to CMS later
```

## 4. Frontend Integration Changes

### Files to Update:
1. **Create API service** - `/frontend/src/services/api.js`
2. **Update Home.jsx** - Fetch products from API
3. **Update FeaturedProducts.jsx** - Use API data
4. **Update ProductGrid.jsx** - Use API data
5. **Add Admin Routes** - `/frontend/src/pages/Admin/`

### API Service Structure:
```javascript
// /frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + '/api'
});

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  toggleFeatured: (id, featured) => API.put(`/products/${id}/toggle-featured`, { featured })
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  // ... etc
};

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  // ... etc
};
```

## 5. Admin Panel Features

### Pages:
1. **Login Page** - `/admin/login`
2. **Dashboard** - `/admin/dashboard` (Overview stats)
3. **Products Management** - `/admin/products`
   - List all products (with search, filter)
   - Add new product
   - Edit product
   - Delete product
   - Toggle featured (with 2-product limit warning)
   - Set country-specific pricing
4. **Categories Management** - `/admin/categories`
5. **Orders Management** - `/admin/orders`
6. **Settings** - `/admin/settings`

### Key Admin Features:
- **Featured Products Control**: 
  - Visual indicator showing which products are featured
  - "Öne Çıkar" toggle button
  - Warning when trying to feature more than 2 products
  - Auto-unfeature oldest if adding 3rd

- **Country Pricing Panel**:
  - For each product, show all countries
  - Input fields for each country's price
  - Currency auto-filled based on country
  - Bulk pricing option (set base price, auto-convert)

## 6. iyzico Integration

### Payment Flow:
1. User adds products to cart
2. User proceeds to checkout
3. Frontend sends order to `/api/orders`
4. Backend creates order in DB
5. Backend initiates iyzico payment
6. Backend returns iyzico payment URL
7. Frontend redirects to iyzico
8. User completes payment
9. iyzico webhook → `/api/iyzico/callback`
10. Backend updates order status
11. Redirect user to success/fail page

### Required iyzico Credentials:
- API Key
- Secret Key
- Base URL (sandbox vs production)

## 7. Security & Validation

### Authentication:
- JWT tokens
- Password hashing (bcrypt)
- Protected admin routes

### Validation:
- Input validation on all endpoints
- File upload validation (images)
- Rate limiting
- CORS configuration

## 8. File Upload

### Image Upload:
- Store in `/app/backend/uploads/products/`
- Serve via `/api/uploads/:filename`
- Or use cloud storage (S3/Cloudinary) for production

## 9. Environment Variables

### Backend (.env):
```
MONGO_URL=mongodb://localhost:27017/zikra_db
JWT_SECRET=your-secret-key
IYZICO_API_KEY=your-iyzico-api-key
IYZICO_SECRET_KEY=your-iyzico-secret
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com (or production)
PORT=8001
```

### Frontend (.env):
```
REACT_APP_BACKEND_URL=https://craponia-commerce.preview.emergentagent.com
```

## 10. Implementation Order

1. **Phase 1: Core Backend**
   - Setup MongoDB models
   - Auth endpoints (login)
   - Products CRUD
   - Categories CRUD

2. **Phase 2: Featured Products Logic**
   - Toggle featured endpoint
   - Validation (max 2)

3. **Phase 3: Country Pricing**
   - Update product model with prices object
   - Pricing endpoints

4. **Phase 4: Frontend Integration**
   - API service
   - Replace mock data
   - Admin panel UI

5. **Phase 5: Orders & iyzico**
   - Order creation
   - iyzico integration
   - Payment flow

6. **Phase 6: Testing**
   - Backend API testing
   - Frontend integration testing
   - Payment flow testing

---

## Notes:
- All mock data currently in `/frontend/src/data/mock.js`
- Frontend uses: products, categories, countries arrays
- Need to seed initial data into MongoDB
- Admin credentials will be created manually first time
