import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2, Edit2, X, ChevronRight } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminCategoriesPage = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('men');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.all || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('valenti_token');
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, gender, description })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'New Category Created');
        setShowModal(false);
        setName('');
        setDescription('');
        fetchCategories();
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('valenti_token');
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('info', 'Category removed');
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      showToast('error', 'Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>COLLECTIONS & CATEGORIES</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Organize the sartorial taxonomy across Menswear and Haute Couture.
            </p>
          </div>

          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{cat.name}</h3>
                  <span className="badge badge-gold" style={{ textTransform: 'uppercase' }}>{cat.gender}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {cat.description || 'Curated pillar collection.'}
                </p>

                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subcategories:</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {cat.subcategories.map((sub, i) => (
                        <span key={i} style={{ padding: '2px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.78rem' }}>
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => handleDelete(cat._id)}
                  style={{ color: '#E53E3E', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>CREATE CATEGORY</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Loungewear"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender Division</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-select"
                >
                  <option value="men">Menswear</option>
                  <option value="women">Womenswear</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  placeholder="Editorial notes on this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary btn-full">
                {saving ? 'Creating...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
