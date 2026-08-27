import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Lock, ArrowRight, Check } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-light)', marginTop: '4rem' }}>
      {/* 1. Value Proposition / Trust Bar */}
      <div style={{ borderBottom: '1px solid var(--border-dark)', padding: '2.5rem 0' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-dark-surface)', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '2px' }}>Complimentary Delivery</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>On all domestic orders above ₹1,999</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-dark-surface)', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '2px' }}>14-Day Atelier Returns</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hassle-free doorstep collection</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-dark-surface)', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '2px' }}>100% Certified Luxury</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Egyptian cotton & Italian merino wool</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-dark-surface)', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <Lock size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '2px' }}>Secure Checkout</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>256-Bit encrypted payment channels</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation & Newsletter */}
      <div className="container" style={{ padding: '4rem 1.5rem 3rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Intro & Newsletter */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: '700', letterSpacing: '0.12em', color: '#FFFFFF' }}>
                VALENTI ATELIER
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '380px' }}>
              Crafting modern sartorial luxury through architectural precision, time-honored Italian tailoring traditions, and the world's finest natural fibers.
            </p>

            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Join the Atelier Gazette
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              Receive invitations to private runway previews & 10% off your inaugural order.
            </p>

            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                <Check size={18} /> Thank you for subscribing to VALENTI Gazette.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: 'flex', maxWidth: '380px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-dark-surface)',
                    border: '1px solid var(--border-dark)',
                    borderRight: 'none',
                    borderRadius: '4px 0 0 4px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ borderRadius: '0 4px 4px 0', padding: '0 1.25rem' }}
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>

          {/* Men Navigation */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              Men's Wardrobe
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><Link to="/men?category=Shirts">Egyptian Cotton Shirts</Link></li>
              <li><Link to="/men?category=Blazers+%26+Suits">Italian Wool Blazers</Link></li>
              <li><Link to="/men?category=T-Shirts">Supima Knitted Polos</Link></li>
              <li><Link to="/men?category=Trousers+%26+Chinos">Gurkha Pleated Trousers</Link></li>
              <li><Link to="/men?category=Jeans">Japanese Selvedge Denim</Link></li>
              <li><Link to="/men">All Menswear</Link></li>
            </ul>
          </div>

          {/* Women Navigation */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              Women's Couture
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><Link to="/women?category=Dresses">Mulberry Silk Slip Gowns</Link></li>
              <li><Link to="/women?category=Blazers+%26+Outerwear">Hourglass Tuxedo Blazers</Link></li>
              <li><Link to="/women?category=Tops+%26+Shirts">Draped Silk Blouses</Link></li>
              <li><Link to="/women?category=Trousers+%26+Skirts">Palazzo Wide-Leg Trousers</Link></li>
              <li><Link to="/women?category=Trousers+%26+Skirts&subcategory=Satin+Skirts">Liquid Satin Skirts</Link></li>
              <li><Link to="/women">All Womenswear</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              Client Concierge
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><Link to="/track-order">Track My Shipment</Link></li>
              <li><Link to="/account">My Valenti Account</Link></li>
              <li><Link to="/cart">Shopping Bag</Link></li>
              <li><Link to="/wishlist">Saved Wishlist</Link></li>
              <li><a href="#size-guide" onClick={(e) => { e.preventDefault(); alert("Atelier Size Consultation: Standard Italian & UK Sizing applies."); }}>Atelier Size Guide</a></li>
              <li><a href="mailto:concierge@valenti.com">Bespoke Concierge</a></li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Copyright Bar */}
        <div style={{
          borderTop: '1px solid var(--border-dark)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <p>© {new Date().getFullYear()} VALENTI ATELIER LTD. All rights reserved. Original Haute Couture & Ready-to-Wear.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Atelier Code of Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
