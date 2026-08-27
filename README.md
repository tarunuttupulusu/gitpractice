# ⚜️ VALENTI ATELIER — Full MERN Clothing E-Commerce Platform

> **A modern, high-fashion luxury clothing e-commerce website and operations management hub built on the MERN stack (MongoDB, Express.js, React.js, Node.js, JWT, REST APIs).**

---

## 🌟 Executive Overview
**VALENTI ATELIER** delivers an editorial luxury shopping experience inspired by world-class fashion brands. It provides a complete end-to-end e-commerce journey from faceted catalog discovery, interactive size guides, and live search autocomplete, to real-time shopping bag management, promo coupon mechanics, a multi-step checkout with mock payment processing, visual order status timeline tracking, and an extensive **Admin Operations Portal**.

---

## 👥 3-Developer Git Architecture & Collaboration Workflow

This project is built around a protected branch strategy designed for 3 independent developer streams:

```
                          main (Protected Production)
                                     ▲
                                     │ (Approved Release PR)
                                  develop (Integration & QA)
                                ▲    ▲    ▲
                                │    │    │
┌───────────────────────────────┴────┼────┴───────────────────────────────┐
│                                    │                                    │
feature/frontend                     feature/backend                      feature/admin
(Developer 1: Storefront             (Developer 2: REST API,              (Developer 3: Admin Portal,
 UI, Pages, Components,              Auth, Database Schemas,              Product/Order Management,
 Cart, Checkout, Wishlist)           Seeding & Middleware)                Inventory & Analytics KPIs)
```

### Developer Responsibilities & Directory Isolation

| Developer Role | Feature Branch | Primary Ownership Directory | Core Responsibilities |
|---|---|---|---|
| **Developer 1 (Frontend)** | `feature/frontend` | `client/src/components/`, `client/src/pages/`, `client/src/features/` | Storefront layout, MegaMenu, Homepage hero, faceted filters, product details zoom, cart drawer, checkout & responsive UI. |
| **Developer 2 (Backend)** | `feature/backend` | `server/` | Node.js Express server, MongoDB Mongoose models, JWT authentication, REST APIs, seeding script, error handling. |
| **Developer 3 (Admin)** | `feature/admin` | `client/src/admin/` | Admin dashboard analytics, inventory management, product CRUD, order dispatch workflow, category manager, coupon promotions. |

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Super Administrator** | `admin@valenti.com` | `Admin@12345` | Full Admin Dashboard, Product CRUD, Order Status transitions, Customer Directory, Coupon Manager |
| **Atelier Patron** | `customer@valenti.com` | `Customer@12345` | Storefront Shopping, Bag & Wishlist, Order History, Address Book, Verified Reviews |

*(Convenient 1-click Demo Autofill buttons are also embedded on the `/login` portal for instant testing).*

---

## 🚀 Key Features

### 🛍️ Customer Storefront (Developer 1)
- **Top Announcement Bar & Header:** Promotional ticker, brand logo treatment, wishlist counter, shopping bag counter, and user profile popover.
- **Dynamic MegaMenu:** Multi-column navigation for Men's and Women's sartorial categories with featured runway lookbooks.
- **Editorial Fashion Homepage:**
  - Hero campaign carousel with high-fashion typography.
  - Dual Gender spotlights (Men's Sartorial Edit & Women's Haute Couture).
  - Curated Wardrobe Pillars (Formal Shirts, Slip Dresses, Italian Blazers, Gurkha Trousers, Japanese Selvedge Denim).
  - Trending Now and Best Sellers product showcases.
  - Customer Perks & Guarantee bar (Complimentary shipping, 14-day returns, certified luxury).
- **Product Listing Catalog (`/men`, `/women`, `/shop`, `/new-arrivals`, `/sale`):**
  - Faceted sidebar filters (Categories, Subcategories, Size pills, Color swatches, Price range slider, In-stock toggle).
  - Sorting: Price Low-to-High, High-to-Low, Newest, Best Rating, Popularity.
  - Responsive Grid switchers (3-column vs 4-column layout, touch-friendly mobile filter drawer).
  - Product Cards with hover secondary image swap, wishlist button, quick-size selector, and Quick View modal.
- **Product Details (`/product/:id`):**
  - Multi-image thumbnail gallery with interactive zoom magnification on hover.
  - Size selection with interactive Atelier Size Chart modal.
  - Color swatches with live selection indicator.
  - Real-time stock status indicator (`Only X pieces left in atelier inventory`).
  - Pincode delivery estimator (e.g. 6-digit Indian PIN codes with BlueDart Air ETA).
  - Expandable tabs for Garment Blueprint, Material Composition, and Laundering Care.
  - Verified Customer Reviews breakdown and review submission form.
  - "Complete the Ensemble" related recommendations.
- **Live Search & Autocomplete (`/search`):**
  - Debounced search query across garment names, descriptions, categories, and luxury fabrics with suggestion highlights.
- **Shopping Bag (`/cart`) & Slide-Over Drawer (`CartDrawer`):**
  - Complimentary shipping goal progress meter (Goal: ₹1,999).
  - Quantity modifiers, item deletion, and "Move to Wishlist".
  - Promo coupon engine supporting `VALENTI10` (10% off), `LUXE20` (20% off), and `WELCOME500`.
- **Checkout Flow (`/checkout`):**
  - Delivery address form with saved address quick-picker.
  - Courier options (Complimentary Air Express vs VIP White-Glove Next-Day).
  - Mock Payment gateway (Credit/Debit Card with realistic inputs, UPI / NetBanking, Cash on Delivery).
- **Order Confirmation & Shipment Tracking (`/track-order`):**
  - Celebratory confetti animation on order completion.
  - Visual status timeline stepper: `Confirmed` → `Processing` → `Shipped` → `Out for Delivery` → `Delivered`.
  - Detailed activity log timestamps.
- **Customer Account Center (`/account`):**
  - Profile details & password updater.
  - Order history with status tags and order cancellation capability.
  - Address book management.
  - Saved Wishlist gallery with 1-click "Move to Bag".

---

### 🛡️ Admin Operations Portal (Developer 3)
- **Executive KPI Dashboard (`/admin/dashboard`):**
  - Total Sales Revenue (₹), Total Orders Count, Registered Patrons, Catalog Garments.
  - Monthly Revenue Performance visual bar chart.
  - Collections revenue & styles breakdown.
  - Low stock warning table.
  - Recent customer orders table.
- **Garment Inventory Management (`/admin/products`):**
  - Search and filter by category or stock status.
  - Create / Edit product modal with multi-image URLs, sizes stock matrix, colors, pricing, sale prices, and curated tags.
  - Delete garment from catalog.
- **Customer Order Fulfilment (`/admin/orders`):**
  - Filter orders by status (`Confirmed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
  - Update order status with optional custom logistics notes (automatically syncs customer timeline).
  - Full customer order modal with line items and delivery coordinates.
- **Category & Taxonomy Manager (`/admin/categories`):**
  - Create, update, and delete categories and subcategories for Men and Women divisions.
- **Clientele Administration (`/admin/users`):**
  - View member list, order counts, and lifetime spend.
  - 1-Click activate or suspend patron accounts.
- **Promo Coupon Engine (`/admin/offers`):**
  - Create discount coupon codes with discount %, minimum spend, and expiry rules.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Vanilla CSS Design System, Lucide React Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, RESTful API Architecture, JWT (JSON Web Tokens), Bcrypt.js, Morgan Logger, CORS |
| **Database** | MongoDB with Mongoose ODM (includes embedded Mongo fallback for instant zero-friction local run) |
| **Version Control** | Git & GitHub (`main`, `develop`, `feature/frontend`, `feature/backend`, `feature/admin`) |

---

## 📁 Repository Structure

```
gitpractice/
├── .gitignore
├── .env.example
├── API_CONTRACT.md
├── package.json               # Root scripts (dev, seed, install:all, build)
├── README.md
│
├── server/                    # DEVELOPER 2 (Backend Ownership)
│   ├── config/
│   │   └── db.js              # MongoDB connection & fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── couponController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT & Admin route protection
│   │   └── errorMiddleware.js  # JSON error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   ├── Review.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── couponRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── package.json
│   ├── seed.js                # Database catalog seeder
│   └── server.js              # Express entry point
│
└── client/                    # DEVELOPER 1 & DEVELOPER 3
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── index.css          # Luxury Design System & Tokens
        ├── App.jsx            # Routing & Provider setup
        ├── main.jsx           # React DOM root
        │
        ├── admin/             # DEVELOPER 3 (Admin Ownership)
        │   ├── components/
        │   │   ├── AdminLayout.jsx
        │   │   └── AdminRoute.jsx
        │   └── pages/
        │       ├── AdminDashboardPage.jsx
        │       ├── AdminProductsPage.jsx
        │       ├── AdminOrdersPage.jsx
        │       ├── AdminCategoriesPage.jsx
        │       ├── AdminUsersPage.jsx
        │       └── AdminOffersPage.jsx
        │
        ├── components/        # DEVELOPER 1 (Storefront Components)
        │   └── common/
        │       ├── Header.jsx
        │       ├── MegaMenu.jsx
        │       ├── Footer.jsx
        │       ├── ProductCard.jsx
        │       ├── QuickViewModal.jsx
        │       ├── CartDrawer.jsx
        │       └── ProtectedRoute.jsx
        │
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   ├── WishlistContext.jsx
        │   └── ToastContext.jsx
        │
        └── pages/             # DEVELOPER 1 (Storefront Pages)
            ├── HomePage.jsx
            ├── ProductListingPage.jsx
            ├── ProductDetailsPage.jsx
            ├── SearchPage.jsx
            ├── CartPage.jsx
            ├── CheckoutPage.jsx
            ├── OrderConfirmationPage.jsx
            ├── AccountPage.jsx
            ├── TrackOrderPage.jsx
            ├── WishlistPage.jsx
            ├── LoginPage.jsx
            └── RegisterPage.jsx
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v26)
- **Git**

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/tarunuttupulusu/gitpractice.git
cd gitpractice

# Install root, backend, and frontend dependencies
npm run install:all
```

### 3. Environment Setup
Copy the sample environment file:
```bash
cp .env.example .env
```
*(Default settings connect to local MongoDB or automatically initialize the in-memory Mongo fallback for instant testing without manual database installation).*

### 4. Seed the Database
Populate luxury garments, categories, sample orders, and demo accounts:
```bash
npm run seed
```

### 5. Launch Full Application
Run both Express server (`http://localhost:5000`) and Vite React storefront (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Visit:
- **Storefront:** `http://localhost:5173`
- **Admin Portal:** `http://localhost:5173/admin/dashboard`
- **Backend API:** `http://localhost:5000/api`

---

## 📜 Git Branch Workflow & Pull Request Checklist

```bash
# Developer 1 (Storefront)
git checkout -b feature/frontend develop

# Developer 2 (Backend API)
git checkout -b feature/backend develop

# Developer 3 (Admin Operations)
git checkout -b feature/admin develop
```

Before opening a Pull Request into `develop`:
1. [x] Run `npm run build` in `client/` to verify clean compilation.
2. [x] Run `node server/server.js` to ensure no route or model conflicts.
3. [x] Adhere strictly to agreed API endpoints specified in [`API_CONTRACT.md`](./API_CONTRACT.md).
4. [x] Include summary of changes and testing performed.