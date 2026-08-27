import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  Users,
  Shirt,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('valenti_token');
        const res = await fetch('/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '120px' }} className="skeleton" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  const { summary, lowStockProducts, recentOrders, bestSellers, categoryBreakdown, monthlyTrends } = data || {
    summary: { totalSales: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0, lowStockCount: 0 },
    lowStockProducts: [],
    recentOrders: [],
    bestSellers: [],
    categoryBreakdown: [],
    monthlyTrends: []
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Page Title & Quick Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '700' }}>
              Atelier Business Intelligence
            </span>
            <h1 style={{ fontSize: '2.2rem', marginTop: '2px' }}>EXECUTIVE DASHBOARD</h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/products" className="btn btn-primary btn-sm">
              <Shirt size={16} /> Manage Catalog
            </Link>
            <Link to="/admin/orders" className="btn btn-gold btn-sm">
              <Package size={16} /> View Orders ({summary.totalOrders})
            </Link>
          </div>
        </div>

        {/* 1. Key Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {/* Total Revenue */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1.75rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: '4px solid var(--accent-gold)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Total Revenue</span>
              <TrendingUp size={20} color="var(--accent-gold)" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              ₹{summary.totalSales.toLocaleString()}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
              +18.4% compared to previous cycle
            </span>
          </div>

          {/* Total Orders */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1.75rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: '4px solid var(--bg-dark)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Total Orders</span>
              <Package size={20} color="var(--bg-dark)" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {summary.totalOrders}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Active luxury clientele transactions
            </span>
          </div>

          {/* Registered Users */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1.75rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: '4px solid var(--accent-emerald)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Atelier Members</span>
              <Users size={20} color="var(--accent-emerald)" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {summary.totalUsers}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
              Verified patron accounts
            </span>
          </div>

          {/* Catalog Items & Low Stock */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1.75rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: summary.lowStockCount > 0 ? '4px solid #E53E3E' : '4px solid var(--border-medium)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Garments in Catalog</span>
              <Shirt size={20} color="var(--text-primary)" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {summary.totalProducts}
            </h3>
            <span style={{ fontSize: '0.75rem', color: summary.lowStockCount > 0 ? '#E53E3E' : 'var(--text-secondary)', fontWeight: '600' }}>
              {summary.lowStockCount > 0 ? `⚠️ ${summary.lowStockCount} items low in inventory` : 'All inventory healthy'}
            </span>
          </div>
        </div>

        {/* 2. Monthly Revenue Chart & Category Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="dashboard-charts-grid">
          {/* Monthly Revenue Bar Chart Simulation */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>MONTHLY REVENUE PERFORMANCE</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Past 6 Months (INR)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
              {monthlyTrends.map((t, idx) => {
                const maxRev = 120000;
                const heightPct = Math.min(100, Math.round((t.revenue / maxRev) * 100));

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      ₹{Math.round(t.revenue / 1000)}k
                    </span>
                    <div
                      style={{
                        width: '42px',
                        height: `${heightPct}%`,
                        backgroundColor: idx === monthlyTrends.length - 1 ? 'var(--accent-gold)' : 'var(--bg-dark)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease'
                      }}
                      title={`${t.month}: ₹${t.revenue.toLocaleString()} (${t.orders} orders)`}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{t.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>COLLECTIONS BREAKDOWN</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoryBreakdown.map((cat) => (
                <div key={cat._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cat._id}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.count} styles</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (cat.count / summary.totalProducts) * 100)}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-gold)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Recent Customer Orders Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>RECENT ATELIER ORDERS</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--accent-gold-hover)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Orders <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Order ID</th>
                  <th style={{ padding: '10px 12px' }}>Client</th>
                  <th style={{ padding: '10px 12px' }}>Items</th>
                  <th style={{ padding: '10px 12px' }}>Amount</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>{order.orderNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontWeight: '600' }}>{order.shippingAddress?.fullName || order.user?.name}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.shippingAddress?.city}</span>
                    </td>
                    <td style={{ padding: '12px' }}>{order.items?.length} pcs</td>
                    <td style={{ padding: '12px', fontWeight: '700' }}>₹{order.pricing?.total?.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: order.orderStatus === 'Delivered' ? '#1C3F3A' : order.orderStatus === 'Shipped' ? '#C5A880' : 'var(--bg-dark)',
                        color: '#FFFFFF'
                      }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Link to={`/admin/orders`} style={{ fontSize: '0.8rem', color: 'var(--accent-gold-hover)', textDecoration: 'underline' }}>
                        Manage Status
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Low Stock Inventory Warnings */}
        {lowStockProducts.length > 0 && (
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: '4px solid #E53E3E'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <AlertTriangle size={20} color="#E53E3E" />
              <h3 style={{ fontSize: '1.15rem', color: '#E53E3E' }}>LOW STOCK INVENTORY ALERTS</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {lowStockProducts.map((p) => (
                <div key={p._id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
                  <img src={p.images?.[0]} alt="" style={{ width: '45px', height: '58px', objectFit: 'cover', borderRadius: '3px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{p.name}</p>
                    <span style={{ fontSize: '0.78rem', color: '#E53E3E', fontWeight: '700' }}>
                      Stock remaining: {p.stock} units
                    </span>
                  </div>
                  <Link to="/admin/products" className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 950px) {
          .dashboard-charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
