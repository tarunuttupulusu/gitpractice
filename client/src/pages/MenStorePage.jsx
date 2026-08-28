import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Heart,
  SlidersHorizontal,
  X,
  ChevronRight,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import QuickViewModal from '../components/common/QuickViewModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const MenStorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Filters from URL
  const categoryParam = searchParams.get('category') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const isNewParam = searchParams.get('newArrival') === 'true';
  const isSaleParam = searchParams.get('onSale') === 'true';

  const [priceRange, setPriceRange] = useState({
    min: minPriceParam || 0,
    max: maxPriceParam || 20000
  });

  const categoriesList = [
    { name: 'All Men', slug: '', path: '/men' },
    { name: 'New Arrivals', slug: 'newArrival', path: '/men?newArrival=true' },
    { name: 'Shirts', slug: 'Shirts', path: '/men?category=Shirts' },
    { name: 'T-Shirts & Polos', slug: 'T-Shirts', path: '/men?category=T-Shirts' },
    { name: 'Blazers & Suits', slug: 'Blazers & Suits', path: '/men?category=Blazers+%26+Suits' },
    { name: 'Trousers & Chinos', slug: 'Trousers & Chinos', path: '/men?category=Trousers+%26+Chinos' },
    { name: 'Jeans', slug: 'Jeans', path: '/men?category=Jeans' },
    { name: 'Knitwear', slug: 'Knitwear', path: '/men?category=Knitwear' },
    { name: 'Sale & Offers', slug: 'onSale', path: '/men?onSale=true', isSale: true }
  ];

  const fetchMenProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('gender', 'men');

      if (categoryParam) params.append('category', categoryParam);
      if (subcategoryParam) params.append('subcategory', subcategoryParam);
      if (minPriceParam) params.append('minPrice', minPriceParam);
      if (maxPriceParam) params.append('maxPrice', maxPriceParam);
      if (sizeParam) params.append('size', sizeParam);
      if (colorParam) params.append('color', colorParam);
      if (isNewParam) params.append('newArrival', 'true');
      if (isSaleParam) params.append('onSale', 'true');

      params.append('sort', sortParam);
      params.append('limit', '40');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
        setTotalProducts(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryParam, subcategoryParam, minPriceParam, maxPriceParam, sizeParam, colorParam, isNewParam, isSaleParam, sortParam]);

  useEffect(() => {
    fetchMenProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchMenProducts]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleQuickAdd = async (product, size) => {
    const primaryColor = product.colors?.[0]?.name || 'Standard';
    const success = await addToCart(product, size, primaryColor, 1);
    if (success) {
      setQuickAddedId(`${product._id}-${size}`);
      addToast(`Added ${product.name} (Size: ${size}) to bag`, 'success');
      setTimeout(() => setQuickAddedId(null), 2000);
    }
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange({ min: 0, max: 20000 });
  };

  const isFiltered = Boolean(categoryParam || subcategoryParam || sizeParam || colorParam || minPriceParam || maxPriceParam || isNewParam || isSaleParam);

  return (
    <div className="hm-section" style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', color: '#000000' }}>
      {/* 1. H&M Men Sub-Navigation Bar */}
      <nav style={{
        borderBottom: '1px solid #E6E6E6',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 'var(--header-height, 84px)',
        zIndex: 40
      }}>
        <div className="container" style={{ display: 'flex', overflowX: 'auto', padding: '0 1rem', scrollbarWidth: 'none' }}>
          {categoriesList.map((cat, idx) => {
            const isActive =
              (!cat.slug && !isFiltered) ||
              (cat.slug === 'newArrival' && isNewParam) ||
              (cat.slug === 'onSale' && isSaleParam) ||
              (cat.slug === categoryParam);

            return (
              <Link
                key={idx}
                to={cat.path}
                className={`hm-subnav-pill ${isActive ? 'active' : ''}`}
                style={{
                  color: cat.isSale ? '#E50010' : '#000000',
                  fontWeight: isActive ? '600' : '400',
                  borderBottom: isActive ? `2px solid ${cat.isSale ? '#E50010' : '#000000'}` : '2px solid transparent'
                }}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 2. Top Campaign Hero (Rendered on main /men landing view) */}
      {!isFiltered && (
        <>
          {/* Main Campaign Hero */}
          <section style={{ position: 'relative', width: '100%', height: '70vh', minHeight: '480px', maxHeight: '680px', overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85"
              alt="H&M Men Collection"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.88)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(2rem, 5vw, 4.5rem)',
              background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
              color: '#FFFFFF'
            }}>
              <div style={{ maxWidth: '640px' }}>
                <span style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFFFFF', fontWeight: '500' }}>
                  H&M MEN — AUTUMN / WINTER 2026
                </span>
                <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', color: '#FFFFFF', fontWeight: '400', margin: '0.5rem 0 1rem 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  THE MODERN SARTORIAL EDIT
                </h1>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', lineHeight: '1.6', maxWidth: '480px' }}>
                  Sharp double-breasted blazers, airy pure French flax linen, and Japanese Kurabo selvedge denim built for daily elegance.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link to="/men?category=Blazers+%26+Suits" className="hm-btn-primary" style={{ backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#FFFFFF' }}>
                    SHOP TAILORING
                  </Link>
                  <Link to="/men?newArrival=true" className="hm-btn-secondary" style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: '#FFFFFF' }}>
                    VIEW NEW IN
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Visual Category Circles / Tiles */}
          <section style={{ padding: '2.5rem 0', borderBottom: '1px solid #E6E6E6', backgroundColor: '#FFFFFF' }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1.5rem',
                textAlign: 'center'
              }}>
                {[
                  { name: 'SHIRTS', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', link: '/men?category=Shirts' },
                  { name: 'T-SHIRTS & POLOS', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80', link: '/men?category=T-Shirts' },
                  { name: 'BLAZERS & SUITS', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80', link: '/men?category=Blazers+%26+Suits' },
                  { name: 'TROUSERS & CHINOS', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80', link: '/men?category=Trousers+%26+Chinos' },
                  { name: 'JEANS & DENIM', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80', link: '/men?category=Jeans' },
                  { name: 'CASHMERE KNITWEAR', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80', link: '/men?category=Knitwear' }
                ].map((cat, i) => (
                  <Link key={i} to={cat.link} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      borderRadius: '0px',
                      overflow: 'hidden',
                      backgroundColor: '#F2F2F2'
                    }}>
                      <img
                        src={cat.img}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#000000' }}>
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Dual Campaign Split Tiles */}
          <section style={{ padding: '3rem 0', backgroundColor: '#FFFFFF' }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Left Card */}
                <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#F2F2F2', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
                    alt="Italian Wool Blazers"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem',
                    color: '#FFFFFF'
                  }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFFFFF' }}>
                      PREMIUM SELECTION
                    </span>
                    <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: '400', margin: '4px 0 12px 0' }}>
                      ITALIAN WOOL SUITING
                    </h3>
                    <Link to="/men?category=Blazers+%26+Suits" className="hm-btn-primary" style={{ width: 'fit-content', backgroundColor: '#FFFFFF', color: '#000000', height: '42px', fontSize: '12px' }}>
                      SHOP NOW
                    </Link>
                  </div>
                </div>

                {/* Right Card */}
                <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#F2F2F2', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
                    alt="Linen & Casual Shirts"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem',
                    color: '#FFFFFF'
                  }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFFFFF' }}>
                      SUMMER ESSENTIALS
                    </span>
                    <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: '400', margin: '4px 0 12px 0' }}>
                      NORMANDY FLAX LINEN
                    </h3>
                    <Link to="/men?category=Shirts&subcategory=Casual+Shirts" className="hm-btn-primary" style={{ width: 'fit-content', backgroundColor: '#FFFFFF', color: '#000000', height: '42px', fontSize: '12px' }}>
                      DISCOVER MORE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 3. Catalog Section with H&M Filtering & Products Grid */}
      <section style={{ padding: '2.5rem 0 5rem 0' }}>
        <div className="container">
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: '1px solid #E6E6E6',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#737373', marginBottom: '4px' }}>
                <Link to="/" style={{ color: '#737373' }}>Home</Link>
                <ChevronRight size={12} />
                <span style={{ color: '#000000', fontWeight: '500' }}>Men</span>
                {categoryParam && (
                  <>
                    <ChevronRight size={12} />
                    <span style={{ color: '#000000', fontWeight: '500' }}>{categoryParam}</span>
                  </>
                )}
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '500', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                {categoryParam ? `Men's ${categoryParam}` : isNewParam ? "Men's New Arrivals" : isSaleParam ? "Men's Sale" : "All Men's Garments"}
              </h2>
              <span style={{ fontSize: '12px', color: '#737373' }}>
                {totalProducts} items found
              </span>
            </div>

            {/* Sort & Filter Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#737373' }}>SORT BY:</span>
              <select
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #000000',
                  borderRadius: '0px',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Newest</option>
                <option value="popular">Recommended / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {isFiltered && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '12px', color: '#737373', textTransform: 'uppercase' }}>Active Filters:</span>
              {categoryParam && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#F2F2F2', fontSize: '12px' }}>
                  Category: {categoryParam}
                  <button onClick={() => updateFilter('category', null)}><X size={12} /></button>
                </span>
              )}
              {subcategoryParam && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#F2F2F2', fontSize: '12px' }}>
                  Subcategory: {subcategoryParam}
                  <button onClick={() => updateFilter('subcategory', null)}><X size={12} /></button>
                </span>
              )}
              {sizeParam && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#F2F2F2', fontSize: '12px' }}>
                  Size: {sizeParam}
                  <button onClick={() => updateFilter('size', null)}><X size={12} /></button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                style={{ fontSize: '12px', textDecoration: 'underline', color: '#E50010', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Main Layout: Subcategories & Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2.5rem' }} className="catalog-grid-wrapper">
            {/* Sidebar Subcategories */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid #000000', paddingBottom: '6px' }}>
                  CATEGORIES
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <button
                    onClick={() => {
                      updateFilter('category', null);
                      updateFilter('subcategory', null);
                    }}
                    style={{
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: !categoryParam ? '600' : '400',
                      color: !categoryParam ? '#000000' : '#737373'
                    }}
                  >
                    View All ({totalProducts})
                  </button>
                  {[
                    { name: 'Shirts', subs: ['Formal Shirts', 'Casual Shirts', 'Party Wear'] },
                    { name: 'T-Shirts', subs: ['Polo', 'Solid'] },
                    { name: 'Blazers & Suits', subs: ['Formal Blazers', 'Casual Blazers', 'Double-Breasted'] },
                    { name: 'Trousers & Chinos', subs: ['Formal Trousers', 'Chinos'] },
                    { name: 'Jeans', subs: ['Selvedge', 'Slim Fit', 'Straight Fit'] },
                    { name: 'Knitwear', subs: ['Cashmere Knitwear', 'Merino Sweaters', 'Cardigans'] }
                  ].map((cat) => (
                    <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        onClick={() => {
                          updateFilter('category', cat.name);
                          updateFilter('subcategory', null);
                        }}
                        style={{
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: categoryParam === cat.name ? '600' : '400',
                          color: categoryParam === cat.name ? '#000000' : '#737373'
                        }}
                      >
                        {cat.name}
                      </button>
                      {categoryParam === cat.name && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '10px', borderLeft: '1px solid #000000' }}>
                          {cat.subs.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateFilter('subcategory', s)}
                              style={{
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                color: subcategoryParam === s ? '#000000' : '#737373',
                                fontWeight: subcategoryParam === s ? '600' : '400'
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes Filter */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid #000000', paddingBottom: '6px' }}>
                  SIZE
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {['S', 'M', 'L', 'XL', '30', '32', '34', '36', '38', '40', '42'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter('size', sizeParam === s ? null : s)}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid',
                        borderColor: sizeParam === s ? '#000000' : '#D9D9D9',
                        backgroundColor: sizeParam === s ? '#000000' : '#FFFFFF',
                        color: sizeParam === s ? '#FFFFFF' : '#000000',
                        fontSize: '12px',
                        borderRadius: '0px',
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Cards Grid (Strict 0px H&M Rectilinear Design) */}
            <main>
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ aspectRatio: '3/4', backgroundColor: '#F2F2F2' }} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#F2F2F2' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '8px' }}>NO PRODUCTS MATCH YOUR SELECTION</h3>
                  <p style={{ fontSize: '13px', color: '#737373', marginBottom: '16px' }}>Try resetting your category or size filters.</p>
                  <button onClick={clearAllFilters} className="hm-btn-primary">
                    VIEW ALL MEN'S STYLES
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.5rem 1.25rem'
                }}>
                  {products.map((product) => {
                    const isFav = isInWishlist(product._id);
                    const isHovered = hoveredProduct === product._id;
                    const discountPercent = product.salePrice
                      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                      : null;

                    return (
                      <div
                        key={product._id}
                        className="hm-product-card"
                        onMouseEnter={() => setHoveredProduct(product._id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        {/* Image Container with 0px corner radius */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#F2F2F2', overflow: 'hidden' }}>
                          <Link to={`/product/${product.slug || product._id}`}>
                            <img
                              src={isHovered && product.images?.[1] ? product.images[1] : product.images?.[0]}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s ease'
                              }}
                            />
                          </Link>

                          {/* Held-in-reserve Red Sale Chip */}
                          {discountPercent && (
                            <span className="hm-sale-chip" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                              -{discountPercent}%
                            </span>
                          )}

                          {/* Red Favourite Heart Icon */}
                          <button
                            onClick={() => toggleWishlist(product)}
                            aria-label="Wishlist"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              width: '32px',
                              height: '32px',
                              backgroundColor: '#FFFFFF',
                              border: 'none',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 10,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Heart
                              size={16}
                              fill={isFav ? '#E50010' : 'none'}
                              color={isFav ? '#E50010' : '#000000'}
                            />
                          </button>

                          {/* Quick View Trigger on Hover */}
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            style={{
                              position: 'absolute',
                              bottom: isHovered ? '46px' : '-40px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              border: '1px solid #000000',
                              borderRadius: '0px',
                              padding: '6px 14px',
                              fontSize: '11px',
                              fontWeight: '600',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                              transition: 'bottom 0.25s ease',
                              zIndex: 15,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Eye size={13} /> QUICK VIEW
                          </button>

                          {/* Quick Size Bar Sliding Up on Hover */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px',
                            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                            transition: 'transform 0.25s ease',
                            zIndex: 12
                          }}>
                            {product.sizes?.map((sz) => (
                              <button
                                key={sz.size}
                                onClick={() => handleQuickAdd(product, sz.size)}
                                disabled={sz.stock === 0}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  border: '1px solid #000000',
                                  borderRadius: '0px',
                                  backgroundColor: quickAddedId === `${product._id}-${sz.size}` ? '#000000' : '#FFFFFF',
                                  color: quickAddedId === `${product._id}-${sz.size}` ? '#FFFFFF' : sz.stock === 0 ? '#CCCCCC' : '#000000',
                                  cursor: sz.stock === 0 ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {quickAddedId === `${product._id}-${sz.size}` ? <Check size={11} /> : sz.size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Product Meta (Strict H&M typography: 12px / 400) */}
                        <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {product.subcategory || product.category}
                          </span>

                          <Link
                            to={`/product/${product.slug || product._id}`}
                            style={{
                              fontSize: '13px',
                              fontWeight: '400',
                              color: '#000000',
                              lineHeight: '1.4',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {product.name}
                          </Link>

                          {/* Pricing with Red Sale Price */}
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                            {product.salePrice ? (
                              <>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#E50010' }}>
                                  ₹{product.salePrice.toLocaleString('en-IN')}
                                </span>
                                <span style={{ fontSize: '12px', color: '#737373', textDecoration: 'line-through' }}>
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                              </>
                            ) : (
                              <span style={{ fontSize: '13px', fontWeight: '500', color: '#000000' }}>
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Color Swatch Dots */}
                          {product.colors?.length > 1 && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                              {product.colors.map((col, idx) => (
                                <span
                                  key={idx}
                                  title={col.name}
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: col.hex,
                                    border: '1px solid #CCCCCC'
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* 4. H&M Member Loyalty Strip */}
      <section style={{ backgroundColor: '#F2F2F2', padding: '3rem 0', textAlign: 'center', borderTop: '1px solid #E6E6E6' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#737373', fontWeight: '600' }}>
            VALENTI × H&M MEMBER
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '400', margin: '0.5rem 0 0.8rem 0', letterSpacing: '-0.01em' }}>
            BECOME A MEMBER & GET 10% OFF
          </h2>
          <p style={{ fontSize: '13px', color: '#737373', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Join our loyalty membership for free to enjoy personalized menswear recommendations, early access to limited edition drops, and free standard delivery on all orders.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Link to="/register" className="hm-btn-primary">
              SIGN UP NOW
            </Link>
            <Link to="/login" className="hm-btn-secondary">
              SIGN IN
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default MenStorePage;
