import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, X, Grid3X3, LayoutGrid, RotateCcw } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';

const ProductListingPage = ({ defaultGender = null, forceNew = false, forceSale = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [facets, setFacets] = useState({ categories: [], sizes: [], colors: [] });

  const [gridCols, setGridCols] = useState(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter States from Query Params
  const categoryParam = searchParams.get('category') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';
  const genderParam = defaultGender || searchParams.get('gender') || 'all';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const inStockParam = searchParams.get('inStock') === 'true';

  const [priceRange, setPriceRange] = useState({
    min: minPriceParam || 0,
    max: maxPriceParam || 25000
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (genderParam && genderParam !== 'all') params.append('gender', genderParam);
      if (categoryParam) params.append('category', categoryParam);
      if (subcategoryParam) params.append('subcategory', subcategoryParam);
      if (minPriceParam) params.append('minPrice', minPriceParam);
      if (maxPriceParam) params.append('maxPrice', maxPriceParam);
      if (sizeParam) params.append('size', sizeParam);
      if (colorParam) params.append('color', colorParam);
      if (inStockParam) params.append('inStock', 'true');
      if (forceNew || searchParams.get('newArrival') === 'true') params.append('newArrival', 'true');
      if (forceSale || searchParams.get('onSale') === 'true') params.append('onSale', 'true');
      if (searchParams.get('featured') === 'true') params.append('featured', 'true');
      if (searchParams.get('bestSeller') === 'true') params.append('bestSeller', 'true');

      params.append('sort', sortParam);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
        setTotalProducts(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.facets) setFacets(data.facets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [genderParam, categoryParam, subcategoryParam, minPriceParam, maxPriceParam, sizeParam, colorParam, sortParam, inStockParam, forceNew, forceSale, currentPage, searchParams]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handlePriceApply = () => {
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min > 0) newParams.set('minPrice', priceRange.min.toString());
    else newParams.delete('minPrice');

    if (priceRange.max < 25000) newParams.set('maxPrice', priceRange.max.toString());
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    if (defaultGender) {
      setSearchParams({ gender: defaultGender });
    } else {
      setSearchParams({});
    }
    setPriceRange({ min: 0, max: 25000 });
    setCurrentPage(1);
  };

  // Determine Title
  let pageTitle = 'All Collections';
  if (forceSale) pageTitle = 'Exclusive Sale & Privileges';
  else if (forceNew) pageTitle = 'New Runway Arrivals';
  else if (genderParam === 'men') pageTitle = categoryParam ? `Men's ${categoryParam}` : "Men's Wardrobe";
  else if (genderParam === 'women') pageTitle = categoryParam ? `Women's ${categoryParam}` : "Women's Couture";
  else if (categoryParam) pageTitle = categoryParam;

  const activeFilters = [];
  if (categoryParam) activeFilters.push({ key: 'category', label: `Category: ${categoryParam}` });
  if (subcategoryParam) activeFilters.push({ key: 'subcategory', label: `Subcategory: ${subcategoryParam}` });
  if (sizeParam) activeFilters.push({ key: 'size', label: `Size: ${sizeParam}` });
  if (colorParam) activeFilters.push({ key: 'color', label: `Color: ${colorParam}` });
  if (minPriceParam || maxPriceParam) activeFilters.push({ key: 'price', label: `₹${minPriceParam || 0} - ₹${maxPriceParam || '25k'}` });

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <ChevronRight size={14} />
          {genderParam !== 'all' && (
            <>
              <Link to={`/${genderParam}`} style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{genderParam}</Link>
              <ChevronRight size={14} />
            </>
          )}
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{pageTitle}</span>
        </div>

        {/* Header Title & Sorting Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
              {pageTitle}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Showing {totalProducts} tailored garments
            </p>
          </div>

          {/* Controls: Mobile Filter Button, View Switcher, Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-outline btn-sm mobile-filter-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <SlidersHorizontal size={16} /> Filters ({activeFilters.length})
            </button>

            {/* Grid Column Switcher (Desktop) */}
            <div className="desktop-grid-toggle" style={{ display: 'flex', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
              <button
                onClick={() => setGridCols(3)}
                style={{ padding: '6px 10px', backgroundColor: gridCols === 3 ? 'var(--bg-secondary)' : 'transparent', color: 'var(--text-primary)' }}
                title="3 Columns"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                style={{ padding: '6px 10px', backgroundColor: gridCols === 4 ? 'var(--bg-secondary)' : 'transparent', color: 'var(--text-primary)' }}
                title="4 Columns"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Sort By:</span>
              <select
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="form-select"
                style={{ padding: '0.5rem 1rem', width: 'auto', minWidth: '170px' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Popularity & Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Filters:
            </span>
            {activeFilters.map((f) => (
              <span
                key={f.key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)'
                }}
              >
                {f.label}
                <button
                  onClick={() => {
                    if (f.key === 'price') {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('minPrice');
                      newParams.delete('maxPrice');
                      setSearchParams(newParams);
                      setPriceRange({ min: 0, max: 25000 });
                    } else {
                      updateFilter(f.key, null);
                    }
                  }}
                  style={{ color: 'var(--text-muted)', padding: '2px' }}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              style={{ fontSize: '0.8rem', color: '#E53E3E', textDecoration: 'underline', marginLeft: '8px' }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Catalog Layout (Sidebar + Products Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem', alignItems: 'start' }} className="catalog-grid-wrapper">
          {/* Desktop Filter Sidebar */}
          <aside className="desktop-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Category Filter */}
            <div>
              <h4 style={{ fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                <button
                  onClick={() => updateFilter('category', 'all')}
                  style={{
                    textAlign: 'left',
                    color: !categoryParam ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                    fontWeight: !categoryParam ? '700' : '400'
                  }}
                >
                  All Categories
                </button>
                {(genderParam === 'women'
                  ? ['Dresses', 'Tops & Shirts', 'Blazers & Outerwear', 'Trousers & Skirts', 'Knitwear & Cashmere', 'Co-ord Sets & Suits', 'Luxury Loungewear & Robes']
                  : genderParam === 'men'
                  ? ['Shirts', 'T-Shirts', 'Blazers & Suits', 'Trousers & Chinos', 'Jeans']
                  : ['Shirts', 'T-Shirts', 'Blazers & Suits', 'Dresses', 'Tops & Shirts', 'Trousers & Chinos', 'Jeans', 'Blazers & Outerwear', 'Trousers & Skirts', 'Knitwear & Cashmere', 'Co-ord Sets & Suits', 'Luxury Loungewear & Robes']
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    style={{
                      textAlign: 'left',
                      color: categoryParam === cat ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                      fontWeight: categoryParam === cat ? '700' : '400'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 style={{ fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                Price (INR)
              </h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
              </div>
              <button
                onClick={handlePriceApply}
                className="btn btn-outline btn-sm btn-full"
              >
                Apply Range
              </button>
            </div>

            {/* Size Filter */}
            <div>
              <h4 style={{ fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                Size
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter('size', sizeParam === s ? null : s)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: sizeParam === s ? '1.5px solid var(--bg-dark)' : '1px solid var(--border-light)',
                      backgroundColor: sizeParam === s ? 'var(--bg-dark)' : '#FFFFFF',
                      color: sizeParam === s ? '#FFFFFF' : 'var(--text-primary)',
                      borderRadius: '4px'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h4 style={{ fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                Colors
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                {[
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Black', hex: '#111111' },
                  { name: 'Navy', hex: '#1B263B' },
                  { name: 'Gold / Champagne', hex: '#D4AF37' },
                  { name: 'Emerald', hex: '#1C3F3A' },
                  { name: 'Camel / Brown', hex: '#C19A6B' }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => updateFilter('color', colorParam === c.name ? null : c.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: colorParam === c.name ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                      fontWeight: colorParam === c.name ? '700' : '400'
                    }}
                  >
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: c.hex, border: '1px solid #CCC' }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Cards Grid */}
          <main>
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gap: '2rem'
              }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ aspectRatio: '3/4' }} className="skeleton" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Garments Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Try resetting your size, color, or price range filters.
                </p>
                <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    gap: '2rem'
                  }}
                  className="product-grid-container"
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4rem' }}>
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            updateFilter('page', pageNum.toString());
                          }}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            backgroundColor: currentPage === pageNum ? 'var(--bg-dark)' : '#FFFFFF',
                            color: currentPage === pageNum ? '#FFFFFF' : 'var(--text-primary)',
                            border: '1px solid var(--border-light)'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="modal-backdrop" onClick={() => setMobileFilterOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>FILTER GARMENTS</h3>
              <button onClick={() => setMobileFilterOpen(false)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</h4>
                <select
                  value={categoryParam}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Categories</option>
                  {(genderParam === 'women'
                    ? ['Dresses', 'Tops & Shirts', 'Blazers & Outerwear', 'Trousers & Skirts', 'Knitwear & Cashmere', 'Co-ord Sets & Suits', 'Luxury Loungewear & Robes']
                    : genderParam === 'men'
                    ? ['Shirts', 'T-Shirts', 'Blazers & Suits', 'Trousers & Chinos', 'Jeans']
                    : ['Shirts', 'T-Shirts', 'Blazers & Suits', 'Dresses', 'Tops & Shirts', 'Trousers & Chinos', 'Jeans', 'Blazers & Outerwear', 'Trousers & Skirts', 'Knitwear & Cashmere', 'Co-ord Sets & Suits', 'Luxury Loungewear & Robes']
                  ).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Size</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40', '42'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter('size', sizeParam === s ? null : s)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.8rem',
                        border: sizeParam === s ? '1.5px solid var(--bg-dark)' : '1px solid var(--border-light)',
                        backgroundColor: sizeParam === s ? 'var(--bg-dark)' : '#FFF',
                        color: sizeParam === s ? '#FFF' : '#000'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn btn-primary btn-full"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .catalog-grid-wrapper { grid-template-columns: 1fr !important; }
          .desktop-sidebar { display: none !important; }
          .desktop-grid-toggle { display: none !important; }
          .product-grid-container { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
        }
        @media (min-width: 901px) {
          .mobile-filter-btn { display: none !important; }
        }
        @media (max-width: 550px) {
          .product-grid-container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductListingPage;
