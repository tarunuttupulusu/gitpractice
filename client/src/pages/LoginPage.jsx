import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const fillAdminDemo = () => {
    setEmail('admin@valenti.com');
    setPassword('Admin@12345');
  };

  const fillCustomerDemo = () => {
    setEmail('customer@valenti.com');
    setPassword('Customer@12345');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: '3rem 2.5rem',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
            Clientele Portal
          </span>
          <h1 style={{ fontSize: '2rem', margin: '0.35rem 0 0.5rem 0' }}>
            SIGN IN TO VALENTI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Access bespoke garment history, saved sizes, and private privileges.
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          border: '1px dashed var(--accent-gold)'
        }}>
          <p style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-gold-hover)', marginBottom: '8px' }}>
            Quick Demo Autofill
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="btn btn-sm btn-outline"
              style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
            >
              <ShieldCheck size={14} /> Admin Account
            </button>
            <button
              type="button"
              onClick={fillCustomerDemo}
              className="btn btn-sm btn-outline"
              style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
            >
              <UserCheck size={14} /> Customer Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo Password Reset: Use credentials admin@valenti.com (Admin@12345) or customer@valenti.com (Customer@12345)"); }} style={{ fontSize: '0.75rem', color: 'var(--accent-gold-hover)' }}>
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>New to Valenti Atelier? </span>
          <Link to="/register" style={{ fontWeight: '700', color: 'var(--accent-gold-hover)' }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
