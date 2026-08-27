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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import MegaMenu from './MegaMenu';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartSummary, setIsDrawerOpen } = useCart();
  const { wishlist } = useWishlist();

  const [activeMenu, setActiveMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchInputRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setShowAccountDropdown(false);
    setShowSearchModal(false);
  }, [location.pathname]);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

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

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 850, backgroundColor: '#FFFFFF', boxShadow: 'var(--shadow-sm)' }}>
      {/* 1. Announcement Bar */}
      <div style={{
        backgroundColor: 'var(--bg-dark)',
        color: '#FFFFFF',
        fontSize: '0.78rem',
        padding: '0.5rem 1rem',
        textAlign: 'center',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}>
        <Sparkles size={14} color="var(--accent-gold)" />
        <span>COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER ₹1,999 • USE CODE <strong style={{ color: 'var(--accent-gold)' }}>VALENTI10</strong> FOR 10% OFF</span>
        <Sparkles size={14} color="var(--accent-gold)" />
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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '1.5px solid var(--accent-gold)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            fontWeight: '700',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem'
          }}>
            V
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: '700',
              letterSpacing: '0.12em',
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              VALENTI
            </span>
            <span style={{
              fontSize: '0.58rem',
              letterSpacing: '0.35em',
              color: 'var(--accent-gold)',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              ATELIER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '100%' }}>
          <div
            onMouseEnter={() => setActiveMenu('men')}
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              to="/men"
              style={{
                fontSize: '0.88rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: activeMenu === 'men' ? 'var(--accent-gold)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Men <ChevronDown size={14} />
            </Link>
          </div>

          <div
            onMouseEnter={() => setActiveMenu('women')}
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              to="/women"
              style={{
                fontSize: '0.88rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: activeMenu === 'women' ? 'var(--accent-gold)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Women <ChevronDown size={14} />
            </Link>
          </div>

          <div
            onMouseEnter={() => setActiveMenu('collections')}
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              to="/shop"
              style={{
                fontSize: '0.88rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: activeMenu === 'collections' ? 'var(--accent-gold)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Collections <ChevronDown size={14} />
            </Link>
          </div>

          <Link
            to="/new-arrivals"
            onMouseEnter={() => setActiveMenu(null)}
            style={{
              fontSize: '0.88rem',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)'
            }}
          >
            New Arrivals
          </Link>

          <Link
            to="/sale"
            onMouseEnter={() => setActiveMenu(null)}
            style={{
              fontSize: '0.88rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--badge-sale)'
            }}
          >
            Sale
          </Link>
        </nav>

        {/* Right Action Icons (Search, Account, Wishlist, Bag) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Quick Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            aria-label="Open Search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.85rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem'
            }}
          >
            <Search size={17} />
            <span className="search-text-hide">Search tailoring, dresses...</span>
          </button>

          {/* Account Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.4rem',
                color: isAuthenticated ? 'var(--accent-gold-hover)' : 'var(--text-primary)'
              }}
              aria-label="Account menu"
            >
              <User size={21} />
              {isAuthenticated && (
                <span style={{ fontSize: '0.8rem', fontWeight: '600', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  top: '120%',
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-light)',
                  zIndex: 1000,
                  padding: '0.75rem 0',
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)' }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                      {isAdmin && (
                        <span className="badge badge-gold" style={{ marginTop: '0.4rem' }}>
                          Administrator
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowAccountDropdown(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.7rem 1rem',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#B39366',
                          backgroundColor: 'rgba(197, 168, 128, 0.08)'
                        }}
                      >
                        <Shield size={16} /> Admin Portal
                      </Link>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setShowAccountDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <Link
                      to="/account?tab=orders"
                      onClick={() => setShowAccountDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Package size={16} /> My Orders
                    </Link>

                    <Link
                      to="/account?tab=addresses"
                      onClick={() => setShowAccountDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <MapPin size={16} /> Saved Addresses
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
                        gap: '0.65rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: '#E53E3E',
                        borderTop: '1px solid var(--border-light)',
                        marginTop: '0.4rem'
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome to VALENTI</p>
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
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            style={{ position: 'relative', padding: '0.4rem', color: 'var(--text-primary)' }}
            aria-label="Wishlist"
          >
            <Heart size={21} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '18px',
                height: '18px',
                backgroundColor: 'var(--accent-gold)',
                color: '#FFFFFF',
                borderRadius: '50%',
                fontSize: '0.68rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Bag Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{ position: 'relative', padding: '0.4rem', color: 'var(--text-primary)' }}
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag size={21} />
            {cartSummary.itemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '18px',
                height: '18px',
                backgroundColor: 'var(--bg-dark)',
                color: '#FFFFFF',
                borderRadius: '50%',
                fontSize: '0.68rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartSummary.itemsCount}
              </span>
            )}
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
            style={{ maxWidth: '650px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>SEARCH VALENTI ATELIER</h3>
              <button onClick={() => setShowSearchModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search shirts, dresses, blazers, fabric, sizes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {/* Quick Suggestions & Live Results */}
            {searchResults.length > 0 ? (
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                  Suggested Products ({searchResults.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={() => setShowSearchModal(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        transition: 'transform var(--transition-fast)'
                      }}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '3px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{product.name}</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{product.category} • {product.gender.toUpperCase()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                          ₹{(product.salePrice || product.price).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim() ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem 0' }}>
                {isSearching ? 'Searching atelier catalog...' : 'No garments found matching your query.'}
              </p>
            ) : (
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                  Trending Searches
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Egyptian Cotton Shirts', 'Silk Maxi Dresses', 'Wool Flannel Blazers', 'Gurkha Trousers', 'Selvedge Denim'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                      }}
                      style={{
                        padding: '0.4rem 0.85rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)'
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
          gap: '1rem',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <Link to="/men" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            SHOP MEN
          </Link>
          <Link to="/women" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            SHOP WOMEN
          </Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            ALL COLLECTIONS
          </Link>
          <Link to="/new-arrivals" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
            NEW ARRIVALS
          </Link>
          <Link to="/sale" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--badge-sale)' }}>
            EXCLUSIVE SALE
          </Link>

          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
              ⚡ ADMIN DASHBOARD
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .search-text-hide { display: none; }
        }
        @media (min-width: 901px) {
          .mobile-only-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
