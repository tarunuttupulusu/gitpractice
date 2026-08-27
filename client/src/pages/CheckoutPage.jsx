import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, ChevronRight, MapPin, Building, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { cartItems, cartSummary, appliedCoupon, clearCart } = useCart();
  const { showToast } = useToast();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Alexander Vance',
    phone: user?.phone || '+91 98765 43210',
    addressLine1: user?.addresses?.[0]?.addressLine1 || '42 Heritage Boulevard, Indiranagar',
    addressLine2: user?.addresses?.[0]?.addressLine2 || 'Penthouse 12',
    city: user?.addresses?.[0]?.city || 'Bengaluru',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '560038',
    country: 'India'
  });

  const [shippingSpeed, setShippingSpeed] = useState('standard'); // standard | express_vip
  const [paymentMethod, setPaymentMethod] = useState('Card'); // Card | UPI | COD
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: user?.name || 'Alexander Vance',
    expiry: '12/28',
    cvv: '888'
  });
  const [upiId, setUpiId] = useState('alexander@okhdfcbank');
  const [placingOrder, setPlacingOrder] = useState(false);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const shippingFee = shippingSpeed === 'express_vip' ? 350 : cartSummary.deliveryCharge;
  const finalTotal = cartSummary.subtotal - cartSummary.discount + shippingFee + cartSummary.tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.postalCode) {
      showToast('error', 'Please provide a complete shipping address');
      return;
    }

    try {
      setPlacingOrder(true);

      const payload = {
        items: cartItems.map(item => ({
          product: item.product?._id || item.product,
          name: item.product?.name || 'Garment',
          image: item.product?.images?.[0] || '',
          price: item.product?.salePrice || item.product?.price || 0,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          subtotal: (item.product?.salePrice || item.product?.price || 0) * item.quantity
        })),
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || null
      };

      let authToken = token;
      // If user is guest or demo token not set, use demo authorization or register guest
      if (!authToken) {
        authToken = localStorage.getItem('valenti_token');
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        await clearCart();
        showToast('success', 'Order placed successfully! Welcome to VALENTI');
        navigate(`/order-confirmation/${data.data._id}`, { state: { order: data.data } });
      } else {
        showToast('error', data.message || 'Order could not be processed');
      }
    } catch (err) {
      showToast('error', 'Network error during order placement');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 0 5rem 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/cart">Bag</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Atelier Checkout</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '2.5rem' }}>
          SECURE ATELIER CHECKOUT
        </h1>

        <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5rem', alignItems: 'start' }} className="checkout-layout">
          {/* Left: Multi-Step Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Step 1: Delivery Address */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <MapPin size={20} color="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  1. Delivery Address
                </h2>
              </div>

              {/* Saved Address Selector if User has addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="form-label">Select Saved Address</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setShippingAddress({
                          fullName: addr.fullName,
                          phone: addr.phone,
                          addressLine1: addr.addressLine1,
                          addressLine2: addr.addressLine2 || '',
                          city: addr.city,
                          state: addr.state,
                          postalCode: addr.postalCode,
                          country: addr.country || 'India'
                        })}
                        style={{
                          padding: '0.85rem',
                          border: shippingAddress.addressLine1 === addr.addressLine1 ? '2px solid var(--accent-gold)' : '1px solid var(--border-light)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: shippingAddress.addressLine1 === addr.addressLine1 ? 'var(--bg-secondary)' : '#FFF',
                          fontSize: '0.85rem',
                          minWidth: '220px'
                        }}
                      >
                        <strong>{addr.fullName}</strong> ({addr.city})
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{addr.addressLine1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address & Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="House/Apartment number, building name, street"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Method */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <Truck size={20} color="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  2. Shipping Speed & Courier
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: shippingSpeed === 'standard' ? '2px solid var(--accent-gold)' : '1px solid var(--border-light)',
                    borderRadius: '4px',
                    backgroundColor: shippingSpeed === 'standard' ? 'var(--bg-secondary)' : '#FFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingSpeed === 'standard'}
                      onChange={() => setShippingSpeed('standard')}
                    />
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>Complimentary Air Express Shipping</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Delivered in 2-3 Business Days via BlueDart Air</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>
                    {cartSummary.deliveryCharge === 0 ? 'FREE' : `₹${cartSummary.deliveryCharge}`}
                  </span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: shippingSpeed === 'express_vip' ? '2px solid var(--accent-gold)' : '1px solid var(--border-light)',
                    borderRadius: '4px',
                    backgroundColor: shippingSpeed === 'express_vip' ? 'var(--bg-secondary)' : '#FFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingSpeed === 'express_vip'}
                      onChange={() => setShippingSpeed('express_vip')}
                    />
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>VIP Next-Day White Glove Delivery</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hand-delivered on silk hanger with bespoke garment bag</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: '700' }}>₹350</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Gateway Selection */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <CreditCard size={20} color="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  3. Payment Method
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                {['Card', 'UPI', 'COD'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: paymentMethod === method ? '2px solid var(--bg-dark)' : '1px solid var(--border-light)',
                      backgroundColor: paymentMethod === method ? 'var(--bg-dark)' : '#FFF',
                      color: paymentMethod === method ? '#FFF' : 'var(--text-primary)',
                      borderRadius: '4px',
                      fontWeight: '700',
                      fontSize: '0.88rem'
                    }}
                  >
                    {method === 'Card' ? 'Credit / Debit Card' : method === 'UPI' ? 'UPI / NetBanking' : 'Cash on Delivery'}
                  </button>
                ))}
              </div>

              {/* Payment Details Form */}
              {paymentMethod === 'Card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="form-group">
                  <label className="form-label">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okaxis"
                    className="form-input"
                  />
                </div>
              )}

              {paymentMethod === 'COD' && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
                  Pay via Cash or QR code to our courier representative upon doorstep handover.
                </p>
              )}
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'sticky',
            top: '100px'
          }}>
            <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              BAG SUMMARY ({cartItems.length} ITEMS)
            </h2>

            {/* Items mini list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '240px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img
                    src={item.product?.images?.[0]}
                    alt=""
                    style={{ width: '45px', height: '58px', objectFit: 'cover', borderRadius: '3px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{item.product?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} | Size: {item.size}</p>
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>
                    ₹{((item.product?.salePrice || item.product?.price || 0) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{cartSummary.subtotal.toLocaleString()}</span>
              </div>
              {cartSummary.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{cartSummary.discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST (5%)</span>
                <span>₹{cartSummary.tax.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.75rem',
                marginTop: '0.5rem'
              }}>
                <span>Total Due</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '0.5rem' }}
            >
              {placingOrder ? 'Processing Atelier Order...' : `Place Order (₹${finalTotal.toLocaleString()})`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Lock size={15} color="var(--accent-gold)" /> 256-Bit SSL Encrypted Payment
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
