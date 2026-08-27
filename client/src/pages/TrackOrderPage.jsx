import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, Package, MapPin, AlertCircle, ChevronRight } from 'lucide-react';

const TrackOrderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTracking = searchParams.get('tracking') || '';

  const [queryInput, setQueryInput] = useState(initialTracking);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  const handleTrack = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/orders/track/${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrderData(data.data);
      } else {
        setError(data.message || 'Shipment not found. Please check your tracking or order number.');
        setOrderData(null);
      }
    } catch (err) {
      setError('Could not connect to tracking server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTracking) {
      handleTrack(initialTracking);
    }
  }, [initialTracking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      setSearchParams({ tracking: queryInput.trim() });
      handleTrack(queryInput.trim());
    }
  };

  const getStepIndex = (status) => {
    return steps.indexOf(status);
  };

  return (
    <div style={{ minHeight: '80vh', padding: '3rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Shipment Concierge</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
            Live Logistics Tracking
          </span>
          <h1 style={{ fontSize: '2.4rem', margin: '0.35rem 0 1rem 0' }}>
            TRACK YOUR ATELIER SHIPMENT
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Enter your Valenti Order Number (e.g. <code>VAL-2026-784912</code>) or BlueDart Tracking ID (e.g. <code>TRK-VAL26-89241</code>).
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '540px', margin: '1.5rem auto 0 auto' }}>
            <input
              type="text"
              required
              placeholder="Enter Tracking ID or Order Number..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">
              <Search size={18} /> Track
            </button>
          </form>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p>Locating shipment status in atelier database...</p>
          </div>
        )}

        {error && (
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: '4px',
            color: '#C53030',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {orderData && (
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)'
          }}>
            {/* Header Details */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '1.25rem',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tracking ID</span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{orderData.trackingNumber}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Order Number: {orderData.orderNumber}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                <div style={{
                  padding: '4px 12px',
                  backgroundColor: 'var(--accent-emerald)',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  marginTop: '2px'
                }}>
                  {orderData.orderStatus}
                </div>
              </div>
            </div>

            {/* Visual Stepper */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '1rem' }}>
                {/* Connecting Line */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '30px',
                  right: '30px',
                  height: '3px',
                  backgroundColor: 'var(--border-light)',
                  zIndex: 1
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: 'var(--accent-gold)',
                    width: `${(Math.max(0, getStepIndex(orderData.orderStatus)) / (steps.length - 1)) * 100}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(orderData.orderStatus);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, width: '90px', textAlign: 'center' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? 'var(--accent-gold)' : '#FFFFFF',
                        border: isCompleted ? '2px solid var(--accent-gold)' : '2px solid var(--border-medium)',
                        color: isCompleted ? '#FFFFFF' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(197, 168, 128, 0.25)' : 'none'
                      }}>
                        {isCompleted ? <CheckCircle2 size={18} /> : <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{idx + 1}</span>}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: isCompleted ? '700' : '400', color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Log */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Activity Log
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orderData.timeline?.map((event, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ padding: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '50%', color: 'var(--accent-gold)' }}>
                      <Clock size={16} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: '600' }}>{event.title}</h5>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{event.description}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
