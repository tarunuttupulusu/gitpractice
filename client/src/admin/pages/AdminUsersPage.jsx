import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, UserX, Shield, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminUsersPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('valenti_token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem('valenti_token');
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: data.data.isActive } : u));
        showToast('info', data.message);
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>CLIENTELE & MEMBERSHIP DIRECTORY</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Oversee registered patrons, order frequency, lifetime spend, and account privileges.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '450px'
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by patron name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem 0.75rem 0.5rem 2.4rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Users Table */}
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
                  <th style={{ padding: '12px 16px' }}>Patron Name</th>
                  <th style={{ padding: '12px' }}>Email & Contact</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Orders Placed</th>
                  <th style={{ padding: '12px' }}>Lifetime Spend</th>
                  <th style={{ padding: '12px' }}>Account Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>Loading member directory...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>No users match search.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{u.name}</strong>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Joined: {new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <p>{u.email}</p>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.phone || 'No phone recorded'}</span>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: u.role === 'admin' ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                          color: u.role === 'admin' ? 'var(--bg-dark)' : 'var(--text-primary)',
                          textTransform: 'uppercase'
                        }}>
                          {u.role}
                        </span>
                      </td>

                      <td style={{ padding: '12px', fontWeight: '600' }}>
                        {u.orderCount || 0} orders
                      </td>

                      <td style={{ padding: '12px', fontWeight: '700' }}>
                        ₹{(u.totalSpent || 0).toLocaleString()}
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: u.isActive ? '#F0FFF4' : '#FFF5F5',
                          color: u.isActive ? 'var(--accent-emerald)' : '#E53E3E',
                          border: u.isActive ? '1px solid #C6F6D5' : '1px solid #FEB2B2'
                        }}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(u._id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              border: u.isActive ? '1px solid #FEB2B2' : '1px solid #C6F6D5',
                              backgroundColor: '#FFF',
                              color: u.isActive ? '#E53E3E' : 'var(--accent-emerald)',
                              cursor: 'pointer'
                            }}
                          >
                            {u.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
