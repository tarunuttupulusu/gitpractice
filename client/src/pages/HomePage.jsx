import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Headphones,
  CheckCircle2,
  Lock,
  Mail
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('featured');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
  };

  const getDisplayedProducts = () => {
    if (activeTab === 'featured') return curated.featured || [];
    if (activeTab === 'bestSellers') return curated.bestSellers || [];
    if (activeTab === 'newArrivals') return curated.newArrivals || [];
    if (activeTab === 'sale') return curated.saleItems || [];
    return curated.featured || [];
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 1. Hero Campaign Banner */}
      <section style={{ position: 'relative', height: '84vh', minHeight: '580px', overflow: 'hidden', backgroundColor: 'var(--bg-dark)' }}>
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
                filter: 'brightness(0.65)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(13, 15, 18, 0.88) 0%, rgba(13, 15, 18, 0.4) 60%, transparent 100%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div className="container" style={{ width: '100%' }}>
                <div style={{ maxWidth: '680px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--accent-gold)" />
                    <span style={{ fontSize: '0.82rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '700' }}>
                      {slide.subtitle}
                    </span>
                  </div>

                  <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', color: '#FFFFFF', fontFamily: 'var(--font-serif)', letterSpacing: '0.04em', lineHeight: 1.12 }}>
                    {slide.title}
                  </h1>

                  <p style={{ fontSize: 'clamp(0.95rem, 1.25vw, 1.15rem)', color: 'rgba(255, 255, 255, 0.88)', lineHeight: '1.75', fontWeight: '300' }}>
                    {slide.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.1rem', marginTop: '0.6rem' }}>
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
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 20
        }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHeroSlide(i)}
              style={{
                width: activeHeroSlide === i ? '36px' : '10px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: activeHeroSlide === i ? 'var(--accent-gold)' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.35s ease'
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Atelier Trust & Guarantees Strip */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-light)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.8rem',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Truck size={22} color="var(--accent-gold-hover)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Complimentary Air Express
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On all orders above ₹1,999</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Award size={22} color="var(--accent-gold-hover)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Bespoke Milanese Tailoring
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Super 140s wool & 6A mulberry silk</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <RotateCcw size={22} color="var(--accent-gold-hover)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  14-Day Atelier Exchanges
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hassle-free size adjustment pickup</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Headphones size={22} color="var(--accent-gold-hover)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Private Concierge Service
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>24/7 dedicated styling advisors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dual Gender Spotlight */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Men Spotlight */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              aspectRatio: '4/5',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80"
                alt="Shop Men's Collection"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)', transition: 'transform 0.8s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13,15,18,0.92) 0%, rgba(13,15,18,0.2) 60%, transparent 100%)',
                padding: '2.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF'
              }}>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '700' }}>
                  Sartorial Menswear
                </span>
                <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', margin: '0.35rem 0 0.85rem 0', fontFamily: 'var(--font-serif)' }}>
                  THE GENTLEMAN'S CODE
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '360px', lineHeight: '1.6' }}>
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
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              aspectRatio: '4/5',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80"
                alt="Shop Women's Collection"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)', transition: 'transform 0.8s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13,15,18,0.92) 0%, rgba(13,15,18,0.2) 60%, transparent 100%)',
                padding: '2.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF'
              }}>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '700' }}>
                  Haute Couture Womenswear
                </span>
                <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', margin: '0.35rem 0 0.85rem 0', fontFamily: 'var(--font-serif)' }}>
                  EFFORTLESS DRAPE & SILK
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '360px', lineHeight: '1.6' }}>
                  Mulberry silk slip gowns, structured tuxedo blazer dresses, and liquid satin skirts.
                </p>
                <Link to="/women" className="btn btn-gold" style={{ width: 'fit-content' }}>
                  Shop Women's Couture <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curated Wardrobe Pillars */}
      <section style={{ padding: '3.5rem 0 5rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '700' }}>
              Curated Wardrobe Pillars
            </span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '0.4rem', fontFamily: 'var(--font-serif)' }}>
              THE SARTORIAL PILLARS
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.6rem'
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
                className="card-luxury-hover"
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.35rem',
                  color: '#FFFFFF',
                  border: '1px solid var(--border-light)'
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
                    transition: 'transform 0.7s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13, 15, 18, 0.88) 0%, transparent 60%)'
                }} />
                <div style={{ position: 'relative', zIndex: 5 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                    {cat.count}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginTop: '3px', fontFamily: 'var(--font-serif)' }}>
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dynamic Runway Tabbed Showcase */}
      <section style={{ padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '700' }}>
              Atelier Collections
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '0.4rem', fontFamily: 'var(--font-serif)' }}>
              DISCOVER THE RUNWAY
            </h2>

            {/* Filter Tabs */}
            <div style={{
              display: 'inline-flex',
              gap: '8px',
              marginTop: '1.8rem',
              padding: '6px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)'
            }}>
              {[
                { id: 'featured', label: 'Curated Runway' },
                { id: 'bestSellers', label: 'Best Sellers' },
                { id: 'newArrivals', label: 'New Season' },
                { id: 'sale', label: 'Privilege Sale' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.55rem 1.35rem',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: activeTab === tab.id ? 'var(--bg-dark)' : 'transparent',
                    color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {getDisplayedProducts().slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/shop" className="btn btn-outline btn-lg">
              Explore Full Atelier Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Editorial Philosophy Quote Section */}
      <section style={{
        position: 'relative',
        padding: '6.5rem 0',
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
          opacity: 0.2,
          background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--accent-gold)" />
              <span style={{ fontSize: '0.82rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: '700' }}>
                THE ATELIER PHILOSOPHY
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4.2vw, 3.2rem)', color: '#FFFFFF', lineHeight: '1.2', fontFamily: 'var(--font-serif)' }}>
              "True luxury is found in the quiet perfection of natural fibers and millimeter-precise seams."
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.85', fontWeight: '300' }}>
              Each VALENTI garment represents over 40 hours of artisanal hand-cutting, floating canvas drafting, and rigorous quality inspection. Sourced exclusively from heritage mills in Biella (Italy) and Normandy (France).
            </p>

            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '0.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '2.2rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>100%</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Natural Fibers</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '2.2rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>140s</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Italian Super Wool</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '2.2rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>22mm</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mulberry Silk Momme</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VIP Patron Privilege Newsletter */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{
            maxWidth: '640px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem'
          }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '700' }}>
              VIP Patron Club
            </span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)' }}>
              JOIN THE VALENTI ATELIER
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Subscribe for private preview access to upcoming seasonal lookbooks, private salon invites, and a complimentary 10% welcome privilege code.
            </p>

            {newsletterSubmitted ? (
              <div style={{
                padding: '1.2rem',
                backgroundColor: 'rgba(22, 59, 53, 0.1)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--accent-emerald)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={20} /> Welcome to the Atelier Patronage! Check your inbox for code <strong>VALENTI10</strong>.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="Enter your personal email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.8rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  Request Invitation
                </button>
              </form>
            )}
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

