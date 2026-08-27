import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  Package,
  FolderTree,
  Users,
  Tag,
  Store,
  LogOut,
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Garments & Inventory', path: '/admin/products', icon: Shirt },
    { name: 'Customer Orders', path: '/admin/orders', icon: Package },
    { name: 'Collections & Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Clientele Management', path: '/admin/users', icon: Users },
    { name: 'Promotions & Coupons', path: '/admin/offers', icon: Tag },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0EFEA' }}>
      {/* 1. Admin Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'var(--bg-dark)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
      }}>
        {/* Brand Banner */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid var(--border-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              fontFamily: 'var(--font-serif)'
            }}>
              V
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFFFFF', letterSpacing: '0.08em', lineHeight: 1 }}>
                VALENTI ATELIER
              </h2>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: '700' }}>
                ADMIN CONTROL CENTER
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '400',
                  color: isActive ? 'var(--bg-dark)' : 'rgba(255,255,255,0.75)',
                  backgroundColor: isActive ? 'var(--accent-gold)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin info & storefront shortcut */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-dark)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              fontSize: '0.82rem',
              color: '#FFFFFF'
            }}
          >
            <Store size={16} color="var(--accent-gold)" /> View Customer Storefront
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#FFFFFF' }}>{user?.name}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>Super Administrator</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{ color: '#E53E3E', padding: '6px' }}
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content View Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '70px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Admin</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
              {navItems.find(n => n.path === location.pathname)?.name || 'Dashboard'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-gold">Developer 3 • Operations Portal</span>
          </div>
        </header>

        {/* Page Inner Container */}
        <main style={{ padding: '2.5rem', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
