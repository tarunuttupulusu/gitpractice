import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, RotateCcw, ChevronRight } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=24`);
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
    fetchResults();
    setSearchInput(query);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Search Catalog</span>
        </div>

        {/* Search Header Form */}
        <div style={{ maxWidth: '680px', margin: '0 auto 3.5rem auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
            Atelier Directory
          </span>
          <h1 style={{ fontSize: '2.4rem', margin: '0.35rem 0 1.5rem 0' }}>
            SEARCH VALENTI ATELIER
          </h1>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search shirts, dresses, blazers, fabric, sizes..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {/* Results Info */}
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>
            {query ? `Results for "${query}" (${products.length} garments)` : 'Enter a query to search'}
          </h2>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ aspectRatio: '3/4' }} className="skeleton" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No garments matched "{query}"</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Check your spelling or explore our classic sartorial collections.
            </p>
            <Link to="/shop" className="btn btn-primary btn-sm">
              Discover All Collections
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default SearchPage;
