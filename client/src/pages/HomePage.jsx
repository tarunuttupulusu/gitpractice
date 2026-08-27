import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';

const HomePage = () => {
  const [curated, setCurated] = useState({
    featured: [],
    newArrivals: [],
    bestSellers: [],
    saleItems: []
  });
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85',
      subtitle: 'AUTUMN / WINTER SARTORIAL COLLECTION',
      title: 'ARCHITECTURAL ELEGANCE',
      description: 'Super 140s Italian merino wool, pure Grade 6A mulberry silk, and hand-tailored silhouettes crafted for the discerning connoisseur.',
      primaryBtn: { text: 'Explore Menswear', link: '/men' },
      secondaryBtn: { text: 'Discover Womenswear', link: '/women' }
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=85',
      subtitle: 'HAUTE COUTURE RUNWAY 2026',
      title: 'THE BESPOKE SILHOUETTE',
      description: 'Fluid silk slip dresses, sculpted tuxedo gowns, and double-breasted power tailoring crafted in our Milanese ateliers.',
      primaryBtn: { text: 'Shop Women\'s Edit', link: '/women' },
      secondaryBtn: { text: 'View All Collections', link: '/shop' }
    }
  ];

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/products/curated/collections');
        const data = await res.json();
        if (data.success) {
          setCurated(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();

    // Auto rotate hero slide every 7 seconds
    const interval = setInterval(() => {
      setActiveHeroSlide(prev => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 1. Hero Campaign Banner */}
      <section style={{ position: 'relative', height: '82vh', minHeight: '560px', overflow: 'hidden', backgroundColor: 'var(--bg-dark)' }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: activeHeroSlide === index ? 1 : 0,
              transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: activeHeroSlide === index ? 'auto' : 'none'
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.68)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(15, 17, 21, 0.85) 0%, rgba(15, 17, 21, 0.3) 60%, transparent 100%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div className="container" style={{ width: '100%' }}>
                <div style={{ maxWidth: '640px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--accent-gold)" />
                    <span style={{ fontSize: '0.82rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '600' }}>
                      {slide.subtitle}
                    </span>
                  </div>

                  <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#FFFFFF', fontFamily: 'var(--font-serif)', letterSpacing: '0.04em', lineHeight: 1.15 }}>
                    {slide.title}
                  </h1>

                  <p style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.7', fontWeight: '300' }}>
                    {slide.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                    <Link to={slide.primaryBtn.link} className="btn btn-gold btn-lg">
                      {slide.primaryBtn.text} <ArrowRight size={18} />
                    </Link>
                    <Link to={slide.secondaryBtn.link} className="btn btn-outline-white btn-lg">
                      {slide.secondaryBtn.text}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Hero Slider Dots */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 20
        }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHeroSlide(i)}
              style={{
                width: activeHeroSlide === i ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: activeHeroSlide === i ? 'var(--accent-gold)' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Dual Gender Spotlight */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {/* Men Spotlight */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              aspectRatio: '4/5',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80"
                alt="Shop Men's Collection"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)', transition: 'transform 0.7s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,17,21,0.85) 0%, transparent 60%)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF'
              }}>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                  Sartorial Menswear
                </span>
                <h2 style={{ fontSize: '2rem', color: '#FFFFFF', margin: '0.25rem 0 1rem 0' }}>
                  THE GENTLEMAN'S CODE
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '340px' }}>
                  Crisp Egyptian Giza shirts, Super 140s wool blazers, and tailored Gurkha trousers.
                </p>
                <Link to="/men" className="btn btn-gold" style={{ width: 'fit-content' }}>
                  Shop Men's Atelier <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Women Spotlight */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              aspectRatio: '4/5',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80"
                alt="Shop Women's Collection"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)', transition: 'transform 0.7s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,17,21,0.85) 0%, transparent 60%)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF'
              }}>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                  Haute Couture Womenswear
                </span>
                <h2 style={{ fontSize: '2rem', color: '#FFFFFF', margin: '0.25rem 0 1rem 0' }}>
                  EFFORTLESS DRAPE & SILK
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '340px' }}>
                  Mulberry silk slip gowns, structured tuxedo blazer dresses, and palazzo wide trousers.
                </p>
                <Link to="/women" className="btn btn-gold" style={{ width: 'fit-content' }}>
                  Shop Women's Couture <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <section style={{ padding: '2rem 0 4.5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
              Curated Wardrobe Pillars
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.35rem' }}>
              THE SARTORIAL EDIT
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { name: 'Formal & Linen Shirts', count: '18 Styles', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', link: '/men?category=Shirts' },
              { name: 'Silk Slip & Evening Dresses', count: '14 Styles', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', link: '/women?category=Dresses' },
              { name: 'Italian Wool Blazers', count: '12 Styles', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', link: '/shop?category=Blazers' },
              { name: 'Gurkha & Palazzo Trousers', count: '16 Styles', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', link: '/shop?category=Trousers' },
              { name: 'Japanese Selvedge Denim', count: '8 Styles', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', link: '/men?category=Jeans' }
            ].map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                  color: '#FFFFFF'
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.72)',
                    transition: 'transform 0.6s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 17, 21, 0.85) 0%, transparent 60%)'
                }} />
                <div style={{ position: 'relative', zIndex: 5 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {cat.count}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginTop: '2px' }}>
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Showcase */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
                Most Coveted
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.35rem' }}>
                ATELIER BEST SELLERS
              </h2>
            </div>
            <Link to="/shop?bestSeller=true" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              View All Best Sellers <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {curated.bestSellers.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Lookbook Banner */}
      <section style={{
        position: 'relative',
        padding: '6rem 0',
        backgroundColor: 'var(--bg-dark)',
        color: '#FFFFFF',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '50%',
          opacity: 0.25,
          background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.82rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '600' }}>
              THE ATELIER PHILOSOPHY
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', lineHeight: '1.2' }}>
              "True luxury is found in the quiet perfection of natural fibers and millimeter-precise seams."
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8' }}>
              Each VALENTI garment represents over 40 hours of artisanal hand-cutting, floating canvas drafting, and rigorous quality inspection. Sourced exclusively from heritage mills in Biella (Italy) and Normandy (France).
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '2rem', fontWeight: '700' }}>100%</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Natural Fine Fibers</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '2rem', fontWeight: '700' }}>140s</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Super Wool Grade</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '2rem', fontWeight: '700' }}>22mm</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Mulberry Silk Momme</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Season Arrivals */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
                Fresh off the Runway
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.35rem' }}>
                NEW SEASON ARRIVALS
              </h2>
            </div>
            <Link to="/new-arrivals" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Explore All New Arrivals <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {curated.newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
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

export default HomePage;
