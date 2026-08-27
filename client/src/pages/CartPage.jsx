import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Heart, ArrowRight, Truck, Tag, ShoppingBag, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartSummary,
    appliedCoupon,
    updateQuantity,
    removeItem,
    applyCouponCode,
    removeCouponCode
  } = useCart();

  const { toggleWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCouponCode(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  const handleMoveToWishlist = (item) => {
    if (item.product) {
      toggleWishlist(item.product);
      removeItem(item._id);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem', minHeight: '60vh' }}>
        <ShoppingBag size={54} color="var(--border-medium)" style={{ margin: '0 auto 1rem auto' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>YOUR ATELIER BAG IS EMPTY</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
          Explore our fine tailoring collections to select garments tailored from Egyptian cotton, Normandy linen, and Italian merino wool.
        </p>
        <Link to="/shop" className="btn btn-primary btn-lg">
          Discover All Collections <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((cartSummary.subtotal / cartSummary.freeDeliveryThreshold) * 100)
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Shopping Bag</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>
          SHOPPING BAG ({cartSummary.itemsCount} {cartSummary.itemsCount === 1 ? 'ITEM' : 'ITEMS'})
        </h1>

        {/* Free Shipping Goal */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <Truck size={18} color="var(--accent-gold)" />
              {cartSummary.amountForFreeDelivery > 0 ? (
                <span>Add <strong>₹{cartSummary.amountForFreeDelivery.toLocaleString()}</strong> more for <strong>Complimentary Express Delivery</strong></span>
              ) : (
                <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>
                  🎉 You have unlocked Complimentary Express Delivery!
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              ₹{cartSummary.subtotal.toLocaleString()} / ₹{cartSummary.freeDeliveryThreshold.toLocaleString()}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${freeDeliveryProgress}%`,
              height: '100%',
              backgroundColor: 'var(--accent-gold)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Main Grid: Items List + Order Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3.5rem', alignItems: 'start' }} className="cart-grid-layout">
          {/* Left: Items Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => {
              const product = item.product || {};
              const price = product.salePrice && product.salePrice < product.price
                ? product.salePrice
                : product.price;

              return (
                <div
                  key={item._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr auto',
                    gap: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid var(--border-light)',
                    alignItems: 'start'
                  }}
                  className="cart-item-row"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                      alt={product.name}
                      style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}
                    />
                  </Link>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {product.brand} • {product.category}
                    </span>
                    <Link to={`/product/${product._id}`}>
                      <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Size: <strong>{item.size}</strong> | Color: <strong>{item.color}</strong>
                    </p>
                    <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                      ₹{(price || 0).toLocaleString()}
                    </p>

                    {/* Quantity modifier and action links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{ padding: '4px 10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '4px 8px', fontSize: '0.85rem', fontWeight: '700' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{ padding: '4px 10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                      >
                        <Heart size={14} /> Move to Wishlist
                      </button>

                      <button
                        onClick={() => removeItem(item._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#E53E3E' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      ₹{((price || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary Card */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              ORDER SUMMARY
            </h2>

            {/* Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(28, 63, 58, 0.08)',
                  border: '1px dashed var(--accent-emerald)',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                    <Tag size={15} /> Coupon: {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                  </div>
                  <button
                    onClick={removeCouponCode}
                    style={{ fontSize: '0.8rem', color: '#E53E3E', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter code (VALENTI10, LUXE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="form-input"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="btn btn-outline btn-sm"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Pricing lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
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
                <span>Estimated Express Shipping</span>
                <span>{cartSummary.deliveryCharge === 0 ? 'FREE' : `₹${cartSummary.deliveryCharge}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Goods & Services Tax (5% GST)</span>
                <span>₹{cartSummary.tax.toLocaleString()}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.85rem',
                marginTop: '0.5rem'
              }}>
                <span>Total Amount</span>
                <span>₹{cartSummary.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '0.5rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--accent-gold)" /> 256-Bit SSL Encrypted & Protected
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .cart-grid-layout { grid-template-columns: 1fr !important; }
          .cart-item-row { grid-template-columns: 80px 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
