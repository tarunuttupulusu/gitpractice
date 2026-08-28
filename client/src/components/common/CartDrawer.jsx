import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles, Tag, ShieldCheck, Lock } from 'lucide-react';
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

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    await applyCouponCode(code);
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
        backgroundColor: 'rgba(13, 15, 18, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-dark)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div style={{
          padding: '1.35rem 1.6rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '2px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={18} color="var(--accent-gold-hover)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>
                Your Atelier Bag
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {cartSummary.itemsCount} curated {cartSummary.itemsCount === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. Free Shipping Progress Bar */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1rem 1.6rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            <Truck size={16} color="var(--accent-gold)" />
            {cartSummary.amountForFreeDelivery > 0 ? (
              <span>Add <strong style={{ color: 'var(--accent-gold-hover)' }}>₹{cartSummary.amountForFreeDelivery.toLocaleString()}</strong> more for <strong>Complimentary Air Express</strong></span>
            ) : (
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="var(--accent-emerald)" /> Complimentary Express Delivery Unlocked!
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${freeDeliveryProgress}%`,
              height: '100%',
              background: freeDeliveryProgress >= 100
                ? 'linear-gradient(90deg, #163B35 0%, #2A6A5E 100%)'
                : 'linear-gradient(90deg, #C5A880 0%, #AF8F60 100%)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* 3. Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.6rem' }}>
          {cartItems.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={28} color="var(--accent-gold-hover)" />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Discover our bespoke menswear, couture gowns, and luxury wardrobe essentials.
              </p>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/shop');
                }}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                Discover Collection
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
                      paddingBottom: '1.1rem',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                  >
                    {/* Item Image */}
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                      alt={product.name}
                      style={{ width: '76px', height: '98px', objectFit: 'cover', borderRadius: '2px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}
                    />

                    {/* Item Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <h4 style={{ fontSize: '0.88rem', fontFamily: 'var(--font-sans)', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.3' }}>
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
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Size: <strong style={{ color: 'var(--text-primary)' }}>{item.size}</strong> • Color: <strong style={{ color: 'var(--text-primary)' }}>{item.color}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        {/* Quantity selector */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '2px' }}>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            style={{ padding: '2px 8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '2px 6px', fontSize: '0.78rem', fontWeight: '700' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{ padding: '2px 8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}
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
            padding: '1.25rem 1.6rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.03)'
          }}>
            {/* Promo Code Input & Quick Chips */}
            <div style={{ marginBottom: '1rem' }}>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  backgroundColor: 'rgba(22, 59, 53, 0.08)',
                  border: '1px dashed var(--accent-emerald)',
                  borderRadius: '3px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                    <Tag size={14} /> {appliedCoupon.code} applied (-{appliedCoupon.discountPercent}%)
                  </div>
                  <button
                    onClick={removeCouponCode}
                    style={{ fontSize: '0.75rem', color: '#D32F2F', fontWeight: '700', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
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

                  {/* 1-Click Test Coupon Chips */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Quick Offers:</span>
                    {['VALENTI10', 'LUXE20'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleApplyCoupon(code)}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          padding: '2px 6px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                          borderRadius: '2px',
                          color: 'var(--accent-gold-hover)'
                        }}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem', marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{cartSummary.subtotal.toLocaleString()}</span>
              </div>
              {cartSummary.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                  <span>Privilege Discount</span>
                  <span>-₹{cartSummary.discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Complimentary Delivery</span>
                <span>{cartSummary.deliveryCharge === 0 ? 'FREE' : `₹${cartSummary.deliveryCharge}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated GST (5%)</span>
                <span>₹{cartSummary.tax.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.1rem',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={handleCheckoutClick}
                className="btn btn-primary btn-full"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Lock size={15} /> Checkout Securely <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/cart');
                }}
                className="btn btn-outline btn-full btn-sm"
              >
                View Full Bag Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

