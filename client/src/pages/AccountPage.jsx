import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, MapPin, Heart, Lock, LogOut, Plus, Trash2, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, token, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    password: ''
  });

  // New Address Form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (activeTab === 'orders' && token) {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true);
          const res = await fetch('/api/orders/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setOrders(data.data || []);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, token]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
    setProfileForm({ ...profileForm, currentPassword: '', password: '' });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const res = await addAddress(addressForm);
    if (res?.success) {
      setShowAddressModal(false);
      setAddressForm({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? data.data : o));
        showToast('info', 'Order cancelled successfully');
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#1C3F3A';
      case 'Shipped': case 'Out for Delivery': return '#C5A880';
      case 'Cancelled': return '#E53E3E';
      default: return '#3182CE';
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.4rem', marginBottom: '2.5rem' }}>
          MY VALENTI ACCOUNT
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3.5rem', alignItems: 'start' }} className="account-grid-layout">
          {/* Left Navigation Sidebar */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{user?.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => setSearchParams({ tab: 'profile' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.9rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'profile' ? '700' : '400',
                  color: activeTab === 'profile' ? 'var(--accent-gold-hover)' : 'var(--text-primary)',
                  backgroundColor: activeTab === 'profile' ? 'var(--bg-primary)' : 'transparent',
                  borderLeft: activeTab === 'profile' ? '3px solid var(--accent-gold)' : '3px solid transparent'
                }}
              >
                <User size={18} /> Personal Profile
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'orders' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.9rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'orders' ? '700' : '400',
                  color: activeTab === 'orders' ? 'var(--accent-gold-hover)' : 'var(--text-primary)',
                  backgroundColor: activeTab === 'orders' ? 'var(--bg-primary)' : 'transparent',
                  borderLeft: activeTab === 'orders' ? '3px solid var(--accent-gold)' : '3px solid transparent'
                }}
              >
                <Package size={18} /> Order History
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'addresses' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.9rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === 'addresses' ? '700' : '400',
                  color: activeTab === 'addresses' ? 'var(--accent-gold-hover)' : 'var(--text-primary)',
                  backgroundColor: activeTab === 'addresses' ? 'var(--bg-primary)' : 'transparent',
                  borderLeft: activeTab === 'addresses' ? '3px solid var(--accent-gold)' : '3px solid transparent'
                }}
              >
                <MapPin size={18} /> Saved Addresses
              </button>

              <Link
                to="/wishlist"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.9rem 1.25rem',
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)'
                }}
              >
                <Heart size={18} /> My Saved Wishlist
              </Link>

              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.9rem 1.25rem',
                  fontSize: '0.88rem',
                  color: '#E53E3E',
                  borderTop: '1px solid var(--border-light)'
                }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>

          {/* Right Tab Content */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
            {/* Tab 1: Profile Form */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                  PERSONAL INFORMATION
                </h2>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="form-input"
                    style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                  Change Password (Optional)
                </h3>

                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password..."
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters..."
                    value={profileForm.password}
                    onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Save Profile Changes
                </button>
              </form>
            )}

            {/* Tab 2: Orders History */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                  ORDER HISTORY & SHIPMENTS
                </h2>

                {ordersLoading ? (
                  <p>Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <Package size={42} color="var(--border-medium)" style={{ margin: '0 auto 1rem auto' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders with VALENTI yet.</p>
                    <Link to="/shop" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        style={{
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Order Header */}
                        <div style={{
                          backgroundColor: 'var(--bg-secondary)',
                          padding: '1rem 1.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}>
                          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Number</span>
                              <p style={{ fontSize: '0.88rem', fontWeight: '700' }}>{order.orderNumber}</p>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Placed On</span>
                              <p style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</span>
                              <p style={{ fontSize: '0.88rem', fontWeight: '700' }}>₹{order.pricing?.total?.toLocaleString()}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: '#FFFFFF',
                                backgroundColor: getStatusColor(order.orderStatus)
                              }}
                            >
                              {order.orderStatus}
                            </span>
                            <Link
                              to={`/track-order?tracking=${order.trackingNumber}`}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            >
                              Track <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <img src={item.image} alt="" style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '3px' }} />
                              <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.name}</h4>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                              </div>
                              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹{item.subtotal?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer Actions */}
                        {(order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed') && (
                          <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'right' }}>
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              style={{ fontSize: '0.8rem', color: '#E53E3E', textDecoration: 'underline' }}
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.3rem' }}>SAVED ADDRESS BOOK</h2>
                  <button onClick={() => setShowAddressModal(true)} className="btn btn-sm btn-primary">
                    <Plus size={16} /> Add New Address
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {user?.addresses?.map((addr) => (
                    <div
                      key={addr._id}
                      style={{
                        padding: '1.25rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        position: 'relative'
                      }}
                    >
                      {addr.isDefault && (
                        <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
                          Default Delivery
                        </span>
                      )}
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{addr.fullName}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                        <br />
                        {addr.city}, {addr.state} - {addr.postalCode}
                        <br />
                        Phone: {addr.phone}
                      </p>
                      <button
                        onClick={() => deleteAddress(addr._id)}
                        style={{ position: 'absolute', top: '16px', right: '16px', color: '#E53E3E' }}
                        title="Delete Address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="modal-backdrop" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>ADD DELIVERY ADDRESS</h3>
            <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  className="form-input"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
                Save Delivery Address
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .account-grid-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AccountPage;
