import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Shirt,
  X,
  Check,
  Upload,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminProductsPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialFormState = {
    name: '',
    description: '',
    category: 'Shirts',
    subcategory: 'Formal Shirts',
    gender: 'men',
    price: 3499,
    salePrice: '',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'],
    colors: [{ name: 'Classic White', hex: '#FFFFFF', inStock: true }],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ],
    material: '100% Egyptian Giza Cotton',
    careInstructions: 'Dry clean or machine wash cold gentle.',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('valenti_token');
      let url = `/api/admin/products?limit=50`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter !== 'all') url += `&category=${encodeURIComponent(categoryFilter)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory || '',
      gender: p.gender,
      price: p.price,
      salePrice: p.salePrice || '',
      images: p.images?.length > 0 ? p.images : ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'],
      colors: p.colors?.length > 0 ? p.colors : [{ name: 'Classic', hex: '#000', inStock: true }],
      sizes: p.sizes?.length > 0 ? p.sizes : [{ size: 'M', stock: 10 }],
      material: p.material || '',
      careInstructions: p.careInstructions || '',
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival,
      isBestSeller: !!p.isBestSeller
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you wish to delete this garment from the active catalog?')) return;
    try {
      const token = localStorage.getItem('valenti_token');
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
        showToast('info', 'Garment removed from catalog');
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Delete operation failed');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('valenti_token');
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', editingProduct ? 'Garment details updated' : 'New garment published to catalog');
        setShowModal(false);
        fetchProducts();
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const updateSizeStock = (index, field, value) => {
    const updated = [...formData.sizes];
    updated[index][field] = field === 'stock' ? Number(value) : value;
    setFormData({ ...formData, sizes: updated });
  };

  const addSizeRow = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: 'XXL', stock: 10 }]
    });
  };

  const removeSizeRow = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
    });
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>GARMENTS & INVENTORY</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Manage haute couture product listings, sizes, variants, pricing, and live inventory.
            </p>
          </div>

          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={18} /> Add New Garment
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.25rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by garment title, brand, material..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ padding: '0.5rem 0.75rem 0.5rem 2.4rem', fontSize: '0.85rem' }}
              />
            </div>
            <button type="submit" className="btn btn-sm btn-primary">Search</button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <option value="all">All Categories ({products.length})</option>
              {['Shirts', 'T-Shirts', 'Blazers & Suits', 'Dresses', 'Tops & Shirts', 'Trousers & Chinos', 'Jeans'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Garment</th>
                  <th style={{ padding: '12px' }}>Category & Gender</th>
                  <th style={{ padding: '12px' }}>Base Price</th>
                  <th style={{ padding: '12px' }}>Sale Price</th>
                  <th style={{ padding: '12px' }}>Stock</th>
                  <th style={{ padding: '12px' }}>Badges</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>Loading catalog inventory...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No garments found matching filter.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                            alt=""
                            style={{ width: '48px', height: '62px', objectFit: 'cover', borderRadius: '3px', backgroundColor: 'var(--bg-secondary)' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{product.name}</strong>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.material?.substring(0, 35)}...</p>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{ fontWeight: '600' }}>{product.category}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{product.gender}</p>
                      </td>

                      <td style={{ padding: '12px', fontWeight: '700' }}>
                        ₹{product.price.toLocaleString()}
                      </td>

                      <td style={{ padding: '12px' }}>
                        {product.salePrice ? (
                          <span style={{ fontWeight: '700', color: 'var(--badge-sale)' }}>
                            ₹{product.salePrice.toLocaleString()}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: product.stock <= 5 ? '#FFF5F5' : '#F0FFF4',
                          color: product.stock <= 5 ? '#E53E3E' : 'var(--accent-emerald)',
                          border: product.stock <= 5 ? '1px solid #FEB2B2' : '1px solid #C6F6D5'
                        }}>
                          {product.stock} units
                        </span>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {product.isFeatured && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Featured</span>}
                          {product.isNewArrival && <span className="badge badge-new" style={{ fontSize: '0.65rem' }}>New</span>}
                          {product.isBestSeller && <span className="badge badge-bestseller" style={{ fontSize: '0.65rem' }}>Best</span>}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => openEditModal(product)}
                            style={{ padding: '6px', color: 'var(--text-secondary)', border: '1px solid var(--border-light)', borderRadius: '4px' }}
                            title="Edit Garment"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            style={{ padding: '6px', color: '#E53E3E', border: '1px solid #FEB2B2', borderRadius: '4px' }}
                            title="Delete Garment"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '800px', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem' }}>
                {editingProduct ? 'EDIT ATELIER GARMENT' : 'ADD NEW HAUTE COUTURE GARMENT'}
              </h2>
              <button onClick={() => setShowModal(false)}><X size={22} /></button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Garment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Giza Oxford Cutaway Shirt"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sartorial Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the fabric weave, collar construction, and silhouette..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="form-select"
                  >
                    <option value="men">Men's Collection</option>
                    <option value="women">Women's Couture</option>
                    <option value="unisex">Unisex Bespoke</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {['Shirts', 'T-Shirts', 'Blazers & Suits', 'Dresses', 'Tops & Shirts', 'Trousers & Chinos', 'Jeans', 'Blazers & Outerwear', 'Trousers & Skirts'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subcategory</label>
                  <input
                    type="text"
                    placeholder="e.g. Formal Shirts, Polo"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Base Retail Price (INR)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Exclusive Sale Price (Optional)</label>
                  <input
                    type="number"
                    placeholder="Leave empty if regular price"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value ? Number(e.target.value) : '' })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Primary Image URL */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Primary High-Res Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.images[0] || ''}
                  onChange={(e) => {
                    const newImgs = [...formData.images];
                    newImgs[0] = e.target.value;
                    setFormData({ ...formData, images: newImgs });
                  }}
                  className="form-input"
                />
              </div>

              {/* Size & Stock Matrix */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Sizes & Inventory Matrix</label>
                  <button type="button" onClick={addSizeRow} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem' }}>
                    + Add Size Variant
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.sizes.map((sz, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Size (S, 40, etc.)"
                        value={sz.size}
                        onChange={(e) => updateSizeStock(idx, 'size', e.target.value)}
                        className="form-input"
                        style={{ width: '120px' }}
                      />
                      <input
                        type="number"
                        placeholder="Stock count"
                        min={0}
                        value={sz.stock}
                        onChange={(e) => updateSizeStock(idx, 'stock', e.target.value)}
                        className="form-input"
                        style={{ width: '140px' }}
                      />
                      {formData.sizes.length > 1 && (
                        <button type="button" onClick={() => removeSizeRow(idx)} style={{ color: '#E53E3E', padding: '4px' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Material & Care */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Material Composition</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Care Instructions</label>
                  <input
                    type="text"
                    value={formData.careInstructions}
                    onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Curated Flags */}
              <div style={{ display: 'flex', gap: '2rem', padding: '0.75rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Featured Runway Look
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  />
                  New Arrival
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  />
                  Bestseller
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-full btn-lg"
              >
                {saving ? 'Publishing Changes...' : editingProduct ? 'Update Garment Catalog Entry' : 'Save & Publish Garment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;
