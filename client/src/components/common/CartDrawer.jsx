import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartSummary,
    appliedCoupon,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    applyCouponCode,
    removeCouponCode
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCouponCode(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((cartSummary.subtotal / cartSummary.freeDeliveryThreshold) * 100)
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 17, 21, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Your Atelier Bag ({cartSummary.itemsCount})
            </h3>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{ color: 'var(--text-muted)', padding: '4px' }}
            aria-label="Close bag"
          >
            <X size={22} />
          </button>
        </div>

        {/* 2. Free Shipping Progress Bar */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '0.85rem 1.5rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            <Truck size={16} color="var(--accent-gold)" />
            {cartSummary.amountForFreeDelivery > 0 ? (
              <span>Add <strong>₹{cartSummary.amountForFreeDelivery.toLocaleString()}</strong> more for <strong>Complimentary Delivery</strong></span>
            ) : (
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>
                🎉 You've unlocked Complimentary Express Delivery!
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${freeDeliveryProgress}%`,
              height: '100%',
              backgroundColor: 'var(--accent-gold)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* 3. Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <ShoppingBag size={48} color="var(--border-medium)" />
              <h4 style={{ fontSize: '1.1rem' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '260px' }}>
                Explore our fine menswear and womenswear collections to fill your sartorial wardrobe.
              </p>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/shop');
                }}
                className="btn btn-primary btn-sm"
              >
                Discover Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map((item) => {
                const product = item.product || {};
                const price = product.salePrice && product.salePrice < product.price
                  ? product.salePrice
                  : product.price;

                return (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                  >
                    {/* Item Image */}
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                      alt={product.name}
                      style={{ width: '75px', height: '95px', objectFit: 'cover', borderRadius: '3px', backgroundColor: 'var(--bg-secondary)' }}
                    />

                    {/* Item Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-sans)', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item._id)}
                            style={{ color: 'var(--text-muted)', padding: '2px' }}
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        {/* Quantity selector */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            style={{ padding: '2px 8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '2px 6px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{ padding: '2px 8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          ₹{((price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Drawer Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#FFFFFF'
          }}>
            {/* Promo Code Input */}
            <div style={{ marginBottom: '1rem' }}>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.85rem',
                  backgroundColor: 'rgba(28, 63, 58, 0.08)',
                  border: '1px dashed var(--accent-emerald)',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                    <Tag size={14} /> {appliedCoupon.code} applied (-{appliedCoupon.discountPercent}%)
                  </div>
                  <button
                    onClick={removeCouponCode}
                    style={{ fontSize: '0.75rem', color: '#E53E3E', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Promo code (e.g. VALENTI10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', textTransform: 'uppercase' }}
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="btn btn-sm btn-outline"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{cartSummary.subtotal.toLocaleString()}</span>
              </div>
              {cartSummary.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)' }}>
                  <span>Privilege Discount</span>
                  <span>-₹{cartSummary.discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Charge</span>
                <span>{cartSummary.deliveryCharge === 0 ? 'FREE' : `₹${cartSummary.deliveryCharge}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated GST (5%)</span>
                <span>₹{cartSummary.tax.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.5rem',
                marginTop: '0.25rem'
              }}>
                <span>Total Amount</span>
                <span>₹{cartSummary.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={handleCheckoutClick}
                className="btn btn-primary btn-full"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/cart');
                }}
                className="btn btn-outline btn-full btn-sm"
              >
                View Full Shopping Bag
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
