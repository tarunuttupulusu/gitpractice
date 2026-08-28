import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Storefront Pages (Developer 1)
import HomePage from './pages/HomePage';
import MenStorePage from './pages/MenStorePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AccountPage from './pages/AccountPage';
import TrackOrderPage from './pages/TrackOrderPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages (Developer 3)
import AdminRoute from './admin/components/AdminRoute';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminProductsPage from './admin/pages/AdminProductsPage';
import AdminOrdersPage from './admin/pages/AdminOrdersPage';
import AdminCategoriesPage from './admin/pages/AdminCategoriesPage';
import AdminUsersPage from './admin/pages/AdminUsersPage';
import AdminOffersPage from './admin/pages/AdminOffersPage';

// Storefront Shell Wrapper with Header, Footer, and Cart Drawer
const StorefrontLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
    <CartDrawer />
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Customer Storefront Routes */}
              <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
              <Route path="/men" element={<StorefrontLayout><MenStorePage /></StorefrontLayout>} />
              <Route path="/women" element={<StorefrontLayout><ProductListingPage defaultGender="women" /></StorefrontLayout>} />
              <Route path="/shop" element={<StorefrontLayout><ProductListingPage /></StorefrontLayout>} />
              <Route path="/new-arrivals" element={<StorefrontLayout><ProductListingPage forceNew={true} /></StorefrontLayout>} />
              <Route path="/sale" element={<StorefrontLayout><ProductListingPage forceSale={true} /></StorefrontLayout>} />
              <Route path="/product/:productId" element={<StorefrontLayout><ProductDetailsPage /></StorefrontLayout>} />
              <Route path="/search" element={<StorefrontLayout><SearchPage /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
              <Route path="/order-confirmation/:orderId" element={<StorefrontLayout><OrderConfirmationPage /></StorefrontLayout>} />
              <Route path="/wishlist" element={<StorefrontLayout><WishlistPage /></StorefrontLayout>} />
              <Route path="/track-order" element={<StorefrontLayout><TrackOrderPage /></StorefrontLayout>} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <StorefrontLayout><AccountPage /></StorefrontLayout>
                </ProtectedRoute>
              } />
              <Route path="/login" element={<StorefrontLayout><LoginPage /></StorefrontLayout>} />
              <Route path="/register" element={<StorefrontLayout><RegisterPage /></StorefrontLayout>} />

              {/* Developer 3: Protected Admin Portal Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="/admin/offers" element={<AdminRoute><AdminOffersPage /></AdminRoute>} />

              {/* 404 Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
