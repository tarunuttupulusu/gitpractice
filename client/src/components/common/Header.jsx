import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Shield,
  LogOut,
  Package,
  MapPin,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import MegaMenu from './MegaMenu';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  const { cartSummary, setIsDrawerOpen } = useCart();
  const { wishlist } = useWishlist();

  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoginLoading, setDemoLoginLoading] = useState(false);

  const searchInputRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setShowAccountDropdown(false);
    setShowSearchModal(false);
  }, [location.pathname]);

  // Keyboard shortcut '/' or 'Ctrl+K' to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !showSearchModal) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowSearchModal(true);
        }
      } else if (e.key === 'Escape' && showSearchModal) {
        setShowSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal]);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const handleQuickDemoLogin = async (email, password) => {
    try {
      setDemoLoginLoading(true);
      await login(email, password);
      setShowAccountDropdown(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoginLoading(false);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 850,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* 1. Announcement Bar */}
      <div style={{
        backgroundColor: 'var(--bg-dark)',
        color: '#FFFFFF',
        fontSize: '0.75rem',
        padding: '0.55rem 1rem',
        textAlign: 'center',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        borderBottom: '1px solid rgba(197, 168, 128, 0.25)'
      }}>
        <Sparkles size={13} color="var(--accent-gold)" />
        <span>
          COMPLIMENTARY EXPRESS AIR SHIPPING ON ORDERS OVER ₹1,999 • USE CODE <strong style={{ color: 'var(--accent-gold)', letterSpacing: '0.12em' }}>VALENTI10</strong> FOR 10% OFF
        </span>
        <Sparkles size={13} color="var(--accent-gold)" />
      </div>

      {/* 2. Main Navigation Header */}
      <div className="container" style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}
          className="mobile-only-btn"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #0D0F12 0%, #1E222B 100%)',
            border: '1.5px solid var(--accent-gold)',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            fontWeight: '700',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            V
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: '700',
              letterSpacing: '0.16em',
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              VALENTI
            </span>
            <span style={{
              fontSize: '0.58rem',
              letterSpacing: '0.38em',
              color: 'var(--accent-gold)',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              ATELIER • MILANO
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2.2rem', height: '100%' }}>
          <div
            onMouseEnter={() => setActiveMenu('men')}
            style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Link
              to="/men"
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeMenu === 'men' ? 'var(--accent-gold)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.5rem 0',
                transition: 'color var(--transition-fast)'
              }}
            >
              Men <ChevronDown size={14} style={{ transform: activeMenu === 'men' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </Link>
          </div>

          <div
            onMouseEnter={() => setActiveMenu('women')}
            style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Link
              to="/women"
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeMenu === 'women' ? 'var(--accent-gold)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.5rem 0',
                transition: 'color var(--transition-fast)'
              }}
            >
              Women <ChevronDown size={14} style={{ transform: activeMenu === 'women' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </Link>
          </div>

          <div
            onMouseEnter={() => setActiveMenu('collections')}
            style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Link
              to="/shop"
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeMenu === 'collections' ? 'var(--accent-gold)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.5rem 0',
                transition: 'color var(--transition-fast)'
              }}
            >
              Collections <ChevronDown size={14} style={{ transform: activeMenu === 'collections' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </Link>
          </div>

          <Link
            to="/new-arrivals"
            onMouseEnter={() => setActiveMenu(null)}
            style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              position: 'relative'
            }}
          >
            New Arrivals
          </Link>

          <Link
            to="/sale"
            onMouseEnter={() => setActiveMenu(null)}
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--badge-sale)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Sale</span>
            <span style={{
              fontSize: '0.62rem',
              backgroundColor: 'var(--badge-sale)',
              color: '#FFFFFF',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: '700'
            }}>
              UP TO 30%
            </span>
          </Link>
        </nav>

        {/* Right Action Icons (Search, Account, Wishlist, Bag) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          {/* Quick Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            aria-label="Open Search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
          >
            <Search size={16} color="var(--accent-gold-hover)" />
            <span className="search-text-hide">Search atelier catalog...</span>
            <span className="search-kbd-shortcut" style={{
              fontSize: '0.68rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              borderRadius: '3px',
              padding: '1px 5px',
              color: 'var(--text-muted)',
              marginLeft: '4px'
            }}>
              /
            </span>
          </button>

          {/* Account Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: showAccountDropdown ? 'var(--bg-secondary)' : 'transparent',
                color: isAuthenticated ? 'var(--accent-gold-hover)' : 'var(--text-primary)',
                transition: 'background-color var(--transition-fast)'
              }}
              aria-label="Account menu"
            >
              <User size={20} />
              {isAuthenticated && (
                <span style={{ fontSize: '0.82rem', fontWeight: '600', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Account Popover */}
            {showAccountDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '125%',
                  width: '280px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-light)',
                  zIndex: 1000,
                  padding: '0.85rem 0',
                  animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</p>
                        {isAdmin ? (
                          <span className="badge badge-gold">
                            Admin
                          </span>
                        ) : (
                          <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-gold-hover)' }}>
                            Patron
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowAccountDropdown(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1.25rem',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          color: '#A6824F',
                          backgroundColor: 'rgba(197, 168, 128, 0.1)'
                        }}
                      >
                        <Shield size={16} /> Admin Operations Hub
                      </Link>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setShowAccountDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.7rem 1.25rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <User size={16} /> Patron Profile & Preferences
                    </Link>

                    <Link
                      to="/account?tab=orders"
                      onClick={() => setShowAccountDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.7rem 1.25rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Package size={16} /> Sartorial Orders History
                    </Link>

                    <Link
                      to="/account?tab=addresses"
                      onClick={() => setShowAccountDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.7rem 1.25rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <MapPin size={16} /> Delivery Address Book
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowAccountDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.25rem',
                        fontSize: '0.85rem',
                        color: '#D32F2F',
                        borderTop: '1px solid var(--border-light)',
                        marginTop: '0.4rem',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>Welcome to VALENTI</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Access bespoke tailoring & exclusive privileges</p>
                    </div>

                    <Link
                      to="/login"
                      onClick={() => setShowAccountDropdown(false)}
                      className="btn btn-sm btn-primary btn-full"
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setShowAccountDropdown(false)}
                      className="btn btn-sm btn-outline btn-full"
                    >
                      Create Patron Account
                    </Link>

                    {/* Quick Demo Switchers */}
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                      <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold-hover)', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Zap size={12} /> Instant 1-Click Demo Login
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                        <button
                          type="button"
                          disabled={demoLoginLoading}
                          onClick={() => handleQuickDemoLogin('customer@valenti.com', 'Customer@12345')}
                          style={{
                            padding: '0.4rem 0.6rem',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                            border: '1px solid var(--border-light)',
                            textAlign: 'center'
                          }}
                        >
                          👤 Customer
                        </button>
                        <button
                          type="button"
                          disabled={demoLoginLoading}
                          onClick={() => handleQuickDemoLogin('admin@valenti.com', 'Admin@12345')}
                          style={{
                            padding: '0.4rem 0.6rem',
                            backgroundColor: 'var(--accent-gold-light)',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: 'var(--accent-gold-hover)',
                            border: '1px solid var(--accent-gold)',
                            textAlign: 'center'
                          }}
                        >
                          🛡️ Admin
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            style={{ position: 'relative', padding: '0.45rem', color: 'var(--text-primary)' }}
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '17px',
                height: '17px',
                backgroundColor: 'var(--accent-gold)',
                color: '#FFFFFF',
                borderRadius: '50%',
                fontSize: '0.65rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(197, 168, 128, 0.4)'
              }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Bag Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{
              position: 'relative',
              padding: '0.45rem 0.85rem',
              backgroundColor: 'var(--bg-dark)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark)'}
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em' }}>
              BAG {cartSummary.itemsCount > 0 && `(${cartSummary.itemsCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* MegaMenu Dropdown */}
      <MegaMenu activeMenu={activeMenu} onClose={() => setActiveMenu(null)} />

      {/* Search Modal Overlay */}
      {showSearchModal && (
        <div className="modal-backdrop" onClick={() => setShowSearchModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.15rem', letterSpacing: '0.08em' }}>SEARCH VALENTI ATELIER</h3>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                style={{ padding: '4px', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search shirts, evening dresses, Italian blazers, silk, linen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="form-input"
                  style={{ paddingLeft: '2.8rem', fontSize: '0.95rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            {/* Quick Suggestions & Live Results */}
            {searchResults.length > 0 ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
                    Suggested Garments ({searchResults.length})
                  </p>
                  <button
                    onClick={handleSearchSubmit}
                    style={{ fontSize: '0.78rem', color: 'var(--accent-gold-hover)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    View all results <ArrowRight size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={() => setShowSearchModal(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'var(--accent-gold)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                      }}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: '46px', height: '58px', objectFit: 'cover', borderRadius: '2px', backgroundColor: '#EAEAEA' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </h4>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{product.category} • {product.gender.toUpperCase()}</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                          ₹{(product.salePrice || product.price).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim() ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                {isSearching ? 'Searching atelier archives...' : 'No couture garments found matching your query.'}
              </p>
            ) : (
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem', fontWeight: '600' }}>
                  Trending Luxury Searches
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {['French Normandy Linen', 'Italian Wool Blazers', 'Mulberry Silk Slip Dresses', 'Pleated Gurkha Trousers', 'Japanese Selvedge Denim', 'Supima Pique Polos'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      style={{
                        padding: '0.45rem 0.95rem',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-gold)';
                        e.currentTarget.style.backgroundColor = 'var(--accent-gold-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-light)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <Link to="/men" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            SHOP MEN
          </Link>
          <Link to="/women" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            SHOP WOMEN
          </Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            ALL ATELIER COLLECTIONS
          </Link>
          <Link to="/new-arrivals" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            NEW SEASON ARRIVALS
          </Link>
          <Link to="/sale" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--badge-sale)' }}>
            EXCLUSIVE PRIVILEGE SALE
          </Link>

          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-gold-hover)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} /> ADMIN OPERATIONS PORTAL
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .search-text-hide { display: none; }
          .search-kbd-shortcut { display: none; }
        }
        @media (min-width: 961px) {
          .mobile-only-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;

