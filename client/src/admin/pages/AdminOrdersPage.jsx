import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  ExternalLink,
  Edit
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Status Change Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Shipped');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Detail Modal
  const [detailOrder, setDetailOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('valenti_token');
      let url = `/api/admin/orders?limit=50`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem('valenti_token');
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          description: statusNote
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Order status progressed to ${newStatus}`);
        setSelectedOrder(null);
        setStatusNote('');
        fetchOrders();
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#1C3F3A', text: '#FFFFFF' };
      case 'Shipped': case 'Out for Delivery':
        return { bg: '#C5A880', text: '#0F1115' };
      case 'Processing':
        return { bg: '#2B6CB0', text: '#FFFFFF' };
      case 'Cancelled':
        return { bg: '#E53E3E', text: '#FFFFFF' };
      default:
        return { bg: '#4A5568', text: '#FFFFFF' };
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '2rem' }}>CUSTOMER ORDERS DISPATCH</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track fulfilment, manage logistics statuses, and oversee atelier shipments.
          </p>
        </div>

        {/* Filter Bar */}
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
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '420px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search order #, tracking #, recipient name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ padding: '0.5rem 0.75rem 0.5rem 2.4rem', fontSize: '0.85rem' }}
              />
            </div>
            <button type="submit" className="btn btn-sm btn-primary">Search</button>
          </form>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: statusFilter === st ? '700' : '500',
                  borderRadius: '4px',
                  backgroundColor: statusFilter === st ? 'var(--bg-dark)' : 'var(--bg-secondary)',
                  color: statusFilter === st ? '#FFFFFF' : 'var(--text-primary)',
                  textTransform: 'capitalize'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
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
                  <th style={{ padding: '12px 16px' }}>Order & Tracking</th>
                  <th style={{ padding: '12px' }}>Customer & Destination</th>
                  <th style={{ padding: '12px' }}>Garments</th>
                  <th style={{ padding: '12px' }}>Payment</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>Loading customer orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found for this status.</td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const badge = getStatusBadge(order.orderStatus);

                    return (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <strong style={{ fontSize: '0.92rem' }}>{order.orderNumber}</strong>
                          <p style={{ fontSize: '0.78rem', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
                            {order.trackingNumber}
                          </p>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>

                        <td style={{ padding: '12px' }}>
                          <p style={{ fontWeight: '600' }}>{order.shippingAddress?.fullName}</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.shippingAddress?.phone}</span>
                        </td>

                        <td style={{ padding: '12px' }}>
                          <span style={{ fontWeight: '600' }}>{order.items?.length} items</span>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {order.items?.[0]?.name?.substring(0, 20)}...
                          </p>
                        </td>

                        <td style={{ padding: '12px' }}>
                          <span style={{ fontWeight: '700' }}>₹{order.pricing?.total?.toLocaleString()}</span>
                          <p style={{ fontSize: '0.75rem', color: order.paymentStatus === 'Paid' ? 'var(--accent-emerald)' : '#E53E3E', fontWeight: '600' }}>
                            {order.paymentMethod} • {order.paymentStatus}
                          </p>
                        </td>

                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            backgroundColor: badge.bg,
                            color: badge.text,
                            textTransform: 'uppercase'
                          }}>
                            {order.orderStatus}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus(order.orderStatus);
                              }}
                              className="btn btn-sm btn-outline"
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            >
                              <Edit size={13} /> Update Status
                            </button>
                            <button
                              onClick={() => setDetailOrder(order)}
                              className="btn btn-sm btn-primary"
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>UPDATE ORDER STATUS</h3>
              <button onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Updating status for <strong>{selectedOrder.orderNumber}</strong> ({selectedOrder.shippingAddress?.fullName}).
            </p>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing (Atelier Tailoring)</option>
                  <option value="Shipped">Shipped (Handed to Courier)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Custom Logistics Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. In transit via BlueDart Air Bangalore Hub"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="btn btn-primary btn-full"
              >
                {updating ? 'Saving Status...' : 'Confirm Status Progression'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Full Order Detail Modal */}
      {detailOrder && (
        <div className="modal-backdrop" onClick={() => setDetailOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem', maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>ORDER {detailOrder.orderNumber}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-hover)' }}>Tracking: {detailOrder.trackingNumber}</span>
              </div>
              <button onClick={() => setDetailOrder(null)}><X size={22} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Recipient */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '4px' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>Shipping Address</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {detailOrder.shippingAddress?.fullName} ({detailOrder.shippingAddress?.phone})<br />
                  {detailOrder.shippingAddress?.addressLine1} {detailOrder.shippingAddress?.addressLine2 && `, ${detailOrder.shippingAddress.addressLine2}`}<br />
                  {detailOrder.shippingAddress?.city}, {detailOrder.shippingAddress?.state} - {detailOrder.shippingAddress?.postalCode}
                </p>
              </div>

              {/* Garments */}
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Garments in Order</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {detailOrder.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.image} alt="" style={{ width: '45px', height: '58px', objectFit: 'cover', borderRadius: '3px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.88rem', fontWeight: '600' }}>{item.name}</p>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</span>
                      </div>
                      <strong style={{ fontSize: '0.9rem' }}>₹{item.subtotal?.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financials */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₹{detailOrder.pricing?.subtotal?.toLocaleString()}</span>
                </div>
                {detailOrder.pricing?.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)' }}>
                    <span>Discount</span>
                    <span>-₹{detailOrder.pricing.discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.05rem', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                  <span>Total Paid</span>
                  <span>₹{detailOrder.pricing?.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage;
