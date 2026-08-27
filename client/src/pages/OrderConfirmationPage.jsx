import React, { useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, MapPin, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Launch gold & dark confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C5A880', '#0F1115', '#1C3F3A', '#FFFFFF']
    });
  }, []);

  return (
    <div style={{ minHeight: '80vh', padding: '4rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(28, 63, 58, 0.1)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
            ORDER CONFIRMED
          </span>
          <h1 style={{ fontSize: '2.4rem', margin: '0.35rem 0 1rem 0' }}>
            THANK YOU FOR YOUR PATRONAGE
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 2rem auto' }}>
            Your order has been verified and forwarded to our master tailors. A confirmation dispatch note has been sent to your email.
          </p>

          {/* Order Snapshot Box */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Number</span>
              <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {order?.orderNumber || `VAL-2026-${orderId?.substring(0, 6)}`}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tracking ID</span>
              <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-gold-hover)' }}>
                {order?.trackingNumber || 'TRK-VAL26-89241'}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Delivery</span>
              <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {order?.estimatedDeliveryDate
                  ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Within 3-5 Business Days'}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Paid</span>
              <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                ₹{(order?.pricing?.total || 4534).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Ordered items preview */}
          {order?.items && (
            <div style={{ textAlign: 'left', marginBottom: '2.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Curated Garments
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={item.image} alt="" style={{ width: '48px', height: '62px', objectFit: 'cover', borderRadius: '3px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: '600' }}>{item.name}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹{item.subtotal?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/track-order?tracking=${encodeURIComponent(order?.trackingNumber || 'TRK-VAL26-89241')}`}
              className="btn btn-primary"
            >
              <Truck size={18} /> Track Shipment
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
