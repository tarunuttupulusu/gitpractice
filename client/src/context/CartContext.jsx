import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    itemsCount: 0,
    subtotal: 0,
    discount: 0,
    deliveryCharge: 0,
    tax: 0,
    total: 0,
    freeDeliveryThreshold: 1999,
    amountForFreeDelivery: 1999
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to recompute guest or local cart
  const calculateLocalSummary = useCallback((items, coupon) => {
    let subtotal = 0;
    let itemsCount = 0;

    items.forEach((item) => {
      const p = item.product;
      if (p) {
        const price = p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
        subtotal += price * item.quantity;
        itemsCount += item.quantity;
      }
    });

    let discount = 0;
    if (coupon && coupon.discountPercent > 0) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    }

    const deliveryCharge = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = Math.max(0, subtotal - discount + deliveryCharge + tax);

    setCartSummary({
      itemsCount,
      subtotal,
      discount,
      deliveryCharge,
      tax,
      total,
      freeDeliveryThreshold: 1999,
      amountForFreeDelivery: Math.max(0, 1999 - subtotal)
    });
  }, []);

  // Fetch cart from backend if authenticated
  const fetchCart = useCallback(async () => {
    if (!token) {
      // Load local guest cart from localStorage
      const local = localStorage.getItem('valenti_guest_cart');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          setCartItems(parsed.items || []);
          setAppliedCoupon(parsed.appliedCoupon || null);
          calculateLocalSummary(parsed.items || [], parsed.appliedCoupon || null);
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.data.items || []);
        setAppliedCoupon(data.data.appliedCoupon?.code ? data.data.appliedCoupon : null);
        setCartSummary({
          itemsCount: data.data.itemsCount,
          subtotal: data.data.subtotal,
          discount: data.data.discount,
          deliveryCharge: data.data.deliveryCharge,
          tax: data.data.tax,
          total: data.data.total,
          freeDeliveryThreshold: data.data.freeDeliveryThreshold,
          amountForFreeDelivery: data.data.amountForFreeDelivery
        });
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [token, calculateLocalSummary]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  // Add product to cart
  const addToCart = async (product, size, color, quantity = 1) => {
    if (!token) {
      // Guest cart fallback
      let updatedItems = [...cartItems];
      const idx = updatedItems.findIndex(
        (i) => (i.product?._id === product._id || i.product === product._id) && i.size === size && i.color === color
      );

      if (idx > -1) {
        updatedItems[idx].quantity += Number(quantity);
      } else {
        updatedItems.push({
          _id: `guest_${Date.now()}_${Math.random()}`,
          product: product,
          size,
          color,
          quantity: Number(quantity)
        });
      }

      setCartItems(updatedItems);
      calculateLocalSummary(updatedItems, appliedCoupon);
      localStorage.setItem('valenti_guest_cart', JSON.stringify({ items: updatedItems, appliedCoupon }));
      showToast('success', `Added ${product.name} (${size}) to Bag`);
      setIsDrawerOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          size,
          color,
          quantity
        })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.data.items || []);
        setAppliedCoupon(data.data.appliedCoupon?.code ? data.data.appliedCoupon : null);
        setCartSummary({
          itemsCount: data.data.itemsCount,
          subtotal: data.data.subtotal,
          discount: data.data.discount,
          deliveryCharge: data.data.deliveryCharge,
          tax: data.data.tax,
          total: data.data.total,
          freeDeliveryThreshold: data.data.freeDeliveryThreshold,
          amountForFreeDelivery: data.data.amountForFreeDelivery
        });
        showToast('success', `Added ${product.name} to Bag`);
        setIsDrawerOpen(true);
      }
    } catch (err) {
      showToast('error', 'Failed to add item to bag');
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    if (!token) {
      const updated = cartItems.map(item => item._id === itemId ? { ...item, quantity: Number(quantity) } : item);
      setCartItems(updated);
      calculateLocalSummary(updated, appliedCoupon);
      localStorage.setItem('valenti_guest_cart', JSON.stringify({ items: updated, appliedCoupon }));
      return;
    }

    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.data.items || []);
        setCartSummary({
          itemsCount: data.data.itemsCount,
          subtotal: data.data.subtotal,
          discount: data.data.discount,
          deliveryCharge: data.data.deliveryCharge,
          tax: data.data.tax,
          total: data.data.total,
          freeDeliveryThreshold: data.data.freeDeliveryThreshold,
          amountForFreeDelivery: data.data.amountForFreeDelivery
        });
      }
    } catch (err) {
      showToast('error', 'Failed to update bag quantity');
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    if (!token) {
      const updated = cartItems.filter(item => item._id !== itemId);
      setCartItems(updated);
      calculateLocalSummary(updated, appliedCoupon);
      localStorage.setItem('valenti_guest_cart', JSON.stringify({ items: updated, appliedCoupon }));
      showToast('info', 'Item removed from bag');
      return;
    }

    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.data.items || []);
        setCartSummary({
          itemsCount: data.data.itemsCount,
          subtotal: data.data.subtotal,
          discount: data.data.discount,
          deliveryCharge: data.data.deliveryCharge,
          tax: data.data.tax,
          total: data.data.total,
          freeDeliveryThreshold: data.data.freeDeliveryThreshold,
          amountForFreeDelivery: data.data.amountForFreeDelivery
        });
        showToast('info', 'Item removed from bag');
      }
    } catch (err) {
      showToast('error', 'Failed to remove item');
    }
  };

  // Apply Promo Coupon
  const applyCouponCode = async (code) => {
    if (!token) {
      if (code.toUpperCase() === 'VALENTI10') {
        const coupon = { code: 'VALENTI10', discountPercent: 10 };
        setAppliedCoupon(coupon);
        calculateLocalSummary(cartItems, coupon);
        showToast('success', 'Promo code VALENTI10 applied! 10% Off');
        return { success: true };
      }
      showToast('error', 'Please log in to apply all exclusive membership coupons');
      return { success: false };
    }

    try {
      const res = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data.appliedCoupon);
        setCartSummary({
          itemsCount: data.data.itemsCount,
          subtotal: data.data.subtotal,
          discount: data.data.discount,
          deliveryCharge: data.data.deliveryCharge,
          tax: data.data.tax,
          total: data.data.total,
          freeDeliveryThreshold: data.data.freeDeliveryThreshold,
          amountForFreeDelivery: data.data.amountForFreeDelivery
        });
        showToast('success', data.message);
        return { success: true };
      } else {
        showToast('error', data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      showToast('error', 'Could not apply coupon');
      return { success: false };
    }
  };

  // Remove Promo Coupon
  const removeCouponCode = async () => {
    if (!token) {
      setAppliedCoupon(null);
      calculateLocalSummary(cartItems, null);
      showToast('info', 'Coupon removed');
      return;
    }

    try {
      const res = await fetch('/api/cart/remove-coupon', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(null);
        fetchCart();
        showToast('info', 'Coupon removed');
      }
    } catch (err) {
      showToast('error', 'Failed to remove coupon');
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('valenti_guest_cart');
    if (token) {
      try {
        await fetch('/api/cart/clear', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartSummary,
      appliedCoupon,
      isDrawerOpen,
      setIsDrawerOpen,
      addToCart,
      updateQuantity,
      removeItem,
      applyCouponCode,
      removeCouponCode,
      clearCart,
      refreshCart: fetchCart,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
