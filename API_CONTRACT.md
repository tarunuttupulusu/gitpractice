# Shared API Contract - VALENTI ATELIER

This document defines the REST API endpoints and data models shared across Developer 1 (Frontend), Developer 2 (Backend), and Developer 3 (Admin).

---

## Base URL
`/api`

---

## 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user & get JWT token | No |
| GET | `/api/auth/profile` | Get current logged in user details | Yes (Bearer) |
| PUT | `/api/auth/profile` | Update current user details | Yes (Bearer) |
| POST | `/api/auth/addresses` | Add a new address to user profile | Yes (Bearer) |
| DELETE | `/api/auth/addresses/:id` | Remove address | Yes (Bearer) |
| POST | `/api/auth/forgot-password`| Request password reset | No |
| POST | `/api/auth/reset-password` | Set new password with token | No |

---

## 2. Product Endpoints (`/api/products`)
| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| GET | `/api/products` | Get list of products with filters | `gender`, `category`, `subcategory`, `minPrice`, `maxPrice`, `size`, `color`, `sort`, `search`, `featured`, `newArrival`, `bestSeller`, `page`, `limit` |
| GET | `/api/products/:id` | Get single product by ID or slug | - |
| GET | `/api/products/slug/:slug` | Get product by slug | - |
| GET | `/api/products/:id/related` | Get related products | `limit` |
| GET | `/api/products/collections/:collection` | Get featured collections | - |

---

## 3. Category Endpoints (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/categories` | Get full category tree (Men, Women, Unisex) with subcategories | No |
| GET | `/api/categories/:slug` | Get single category info | No |

---

## 4. Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/cart` | Get current user's active cart | Yes |
| POST | `/api/cart/items` | Add item `{ productId, size, color, quantity }` | Yes |
| PUT | `/api/cart/items/:itemId` | Update quantity | Yes |
| DELETE | `/api/cart/items/:itemId` | Remove item from cart | Yes |
| POST | `/api/cart/apply-coupon` | Apply promo code `{ code }` | Yes |
| DELETE | `/api/cart/remove-coupon`| Remove promo code | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |

---

## 5. Wishlist (`/api/wishlist`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/wishlist` | Get user's saved wishlist | Yes |
| POST | `/api/wishlist/toggle` | Add/Remove product `{ productId }` | Yes |
| POST | `/api/wishlist/move-to-cart` | Transfer wishlist product to cart `{ productId, size, color }` | Yes |

---

## 6. Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/orders` | Place new order `{ items, shippingAddress, paymentMethod, couponCode }` | Yes |
| GET | `/api/orders/my-orders` | Get user's order history | Yes |
| GET | `/api/orders/:id` | Get single order details | Yes |
| GET | `/api/orders/track/:trackingNumber` | Track order status timeline | No |
| PUT | `/api/orders/:id/cancel` | Cancel order if eligible (Pending/Confirmed) | Yes |

---

## 7. Reviews (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/reviews/product/:productId` | Get reviews for a product | No |
| POST | `/api/reviews` | Submit a review `{ productId, rating, title, comment }` | Yes |

---

## 8. Coupons (`/api/coupons`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/coupons/validate` | Validate coupon code and get discount amount | Yes |

---

## 9. Admin Endpoints (`/api/admin`) - Developer 3
| Method | Endpoint | Description | Auth Guard |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Analytics KPIs (Sales, Orders, Users, Inventory, Charts) | Admin |
| GET | `/api/admin/products` | List all products with stock status | Admin |
| POST | `/api/admin/products` | Create new product | Admin |
| PUT | `/api/admin/products/:id` | Update product details | Admin |
| DELETE | `/api/admin/products/:id` | Delete product | Admin |
| GET | `/api/admin/orders` | View all customer orders with filters | Admin |
| PUT | `/api/admin/orders/:id/status` | Update order status (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`) | Admin |
| GET | `/api/admin/users` | List all registered users and stats | Admin |
| PUT | `/api/admin/users/:id/status` | Toggle user active/suspended | Admin |
| POST | `/api/admin/categories` | Create category / subcategory | Admin |
| PUT | `/api/admin/categories/:id` | Edit category | Admin |
| DELETE | `/api/admin/categories/:id` | Delete category | Admin |
| GET | `/api/admin/coupons` | List all promo coupons | Admin |
| POST | `/api/admin/coupons` | Create new coupon | Admin |
| DELETE | `/api/admin/coupons/:id` | Delete coupon | Admin |
