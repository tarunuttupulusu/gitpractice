import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X, CheckCircle2, Calendar } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminOffersPage = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountPercent: 15,
    minOrderValue: 2999,
    maxDiscountAmount: 3000
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('valenti_token');
      const res = await fetch('/api/admin/coupons', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('valenti_token');
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Promotion code ${form.code} created`);
        setShowModal(false);
        setForm({ code: '', description: '', discountPercent: 15, minOrderValue: 2999, maxDiscountAmount: 3000 });
        fetchCoupons();
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Failed to create promo code');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      const token = localStorage.getItem('valenti_token');
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('info', 'Promo code removed');
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      showToast('error', 'Failed to remove promo code');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>PROMOTIONS & PRIVILEGE CODES</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Manage seasonal campaigns, runway discount codes, and client privileges.
            </p>
          </div>

          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} /> Create Promotion Code
          </button>
        </div>

        {/* Coupons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {coupons.map((c) => (
            <div
              key={c._id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px dashed var(--accent-gold)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={20} color="var(--accent-gold)" />
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                      {c.code}
                    </span>
                  </div>
                  <span className="badge badge-sale" style={{ fontSize: '0.8rem' }}>
                    {c.discountPercent}% OFF
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {c.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p>Min. Order Value: <strong>₹{c.minOrderValue.toLocaleString()}</strong></p>
                  <p>Max. Discount: <strong>₹{c.maxDiscountAmount.toLocaleString()}</strong></p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1.25rem' }}>
                <button
                  onClick={() => handleDelete(c._id)}
                  style={{ color: '#E53E3E', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={15} /> Delete Promo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>CREATE PRIVILEGE CODE</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontWeight: '700' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25% VIP Autumn Runway Privilege"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={90}
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min. Order Value (INR)</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
                {saving ? 'Creating...' : 'Publish Promotion Code'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOffersPage;
