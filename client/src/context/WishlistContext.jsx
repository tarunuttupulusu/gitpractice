import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      const local = localStorage.getItem('valenti_guest_wishlist');
      if (local) {
        try {
          setWishlist(JSON.parse(local));
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, user]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id === productId || item === productId));
  };

  const toggleWishlist = async (product) => {
    const isPresent = isInWishlist(product._id);

    if (!token) {
      let updated;
      if (isPresent) {
        updated = wishlist.filter(item => item._id !== product._id && item !== product._id);
        showToast('info', `Removed ${product.name} from Wishlist`);
      } else {
        updated = [...wishlist, product];
        showToast('success', `Saved ${product.name} to Wishlist`);
      }
      setWishlist(updated);
      localStorage.setItem('valenti_guest_wishlist', JSON.stringify(updated));
      return;
    }

    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.data || []);
        showToast(data.action === 'added' ? 'success' : 'info', data.message);
      }
    } catch (err) {
      showToast('error', 'Could not update wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isInWishlist,
      toggleWishlist,
      refreshWishlist: fetchWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
