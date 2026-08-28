import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const MegaMenu = ({ activeMenu, onClose }) => {
  if (!activeMenu) return null;

  const menCategories = [
    {
      title: 'Shirts & Tops',
      items: [
        { name: 'Formal Shirts', path: '/men?category=Shirts&subcategory=Formal+Shirts' },
        { name: 'Casual Linen Shirts', path: '/men?category=Shirts&subcategory=Casual+Shirts' },
        { name: 'Evening & Party Wear', path: '/men?category=Shirts&subcategory=Party+Wear' },
        { name: 'Supima Pique Polos', path: '/men?category=T-Shirts&subcategory=Polo' },
        { name: 'Solid Luxury Tees', path: '/men?category=T-Shirts&subcategory=Solid' }
      ]
    },
    {
      title: 'Suits & Tailoring',
      items: [
        { name: 'Italian Wool Blazers', path: '/men?category=Blazers+%26+Suits&subcategory=Formal+Blazers' },
        { name: 'Double-Breasted Jackets', path: '/men?category=Blazers+%26+Suits' },
        { name: 'Pleated Gurkha Trousers', path: '/men?category=Trousers+%26+Chinos&subcategory=Formal+Trousers' },
        { name: 'Tailored Chinos', path: '/men?category=Trousers+%26+Chinos&subcategory=Chinos' }
      ]
    },
    {
      title: 'Denim & Casuals',
      items: [
        { name: 'Japanese Selvedge Denim', path: '/men?category=Jeans' },
        { name: 'Slim Tapered Jeans', path: '/men?category=Jeans&subcategory=Slim+Fit' },
        { name: 'Cashmere Knitwear', path: '/men?category=Sweatshirts' },
        { name: 'View All Men\'s Collection', path: '/men', isHighlight: true }
      ]
    }
  ];

  const womenCategories = [
    {
      title: 'Dresses & Gowns',
      items: [
        { name: 'Mulberry Silk Slip Gowns', path: '/women?category=Dresses&subcategory=Evening+Gowns' },
        { name: 'Sculpted Blazer Dresses', path: '/women?category=Dresses&subcategory=Blazer+Dresses' },
        { name: 'Midi Silhouette Dresses', path: '/women?category=Dresses&subcategory=Midi+Dresses' },
        { name: 'Cocktail & Evening', path: '/women?category=Dresses' }
      ]
    },
    {
      title: 'Tailoring & Outerwear',
      items: [
        { name: 'Power Tuxedo Blazers', path: '/women?category=Blazers+%26+Outerwear&subcategory=Tailored+Blazers' },
        { name: 'Cashmere Trench Coats', path: '/women?category=Blazers+%26+Outerwear&subcategory=Trench+Coats' },
        { name: 'Silk Crepe Blouses', path: '/women?category=Tops+%26+Shirts&subcategory=Silk+Blouses' },
        { name: 'Poplin Formal Shirts', path: '/women?category=Tops+%26+Shirts' }
      ]
    },
    {
      title: 'Knitwear & Sets',
      items: [
        { name: 'Pure Mongolian Cashmere', path: '/women?category=Knitwear+%26+Cashmere' },
        { name: 'Tweed & Tailored Sets', path: '/women?category=Co-ord+Sets+%26+Suits' },
        { name: 'Silk Pajamas & Robes', path: '/women?category=Luxury+Loungewear+%26+Robes' },
        { name: 'Palazzo Trousers & Skirts', path: '/women?category=Trousers+%26+Skirts' },
        { name: 'View All Women\'s Couture', path: '/women', isHighlight: true }
      ]
    }
  ];

  const collections = [
    {
      title: 'Curated Editions',
      items: [
        { name: 'The Sartorial Black Tie Edit', path: '/shop?featured=true' },
        { name: 'French Normandy Linen Series', path: '/men?category=Shirts' },
        { name: 'Pure 22-Momme Silk Capsule', path: '/women?category=Dresses' },
        { name: 'Autumn / Winter Runway', path: '/shop?newArrival=true' }
      ]
    },
    {
      title: 'Featured Campaigns',
      items: [
        { name: 'Quiet Luxury Essentials', path: '/shop?bestSeller=true' },
        { name: 'Privilege Member Sale (Up to 30% Off)', path: '/sale' },
        { name: 'New Season Arrivals', path: '/new-arrivals' }
      ]
    }
  ];

  let activeData = [];
  let featuredBanner = {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    title: 'THE RUNWAY EDIT',
    subtitle: 'Fall / Winter Haute Couture',
    link: '/shop'
  };

  if (activeMenu === 'men') {
    activeData = menCategories;
    featuredBanner = {
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      title: 'MENSWEAR BESPOKE',
      subtitle: 'Super 140s Italian Wool & Giza Cotton',
      link: '/men'
    };
  } else if (activeMenu === 'women') {
    activeData = womenCategories;
    featuredBanner = {
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      title: 'WOMEN COUTURE',
      subtitle: 'Silk Slip Silhouettes & Power Tailoring',
      link: '/women'
    };
  } else if (activeMenu === 'collections') {
    activeData = collections;
    featuredBanner = {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      title: 'THE ATELIER LOOKBOOK',
      subtitle: 'Handcrafted Sartorial Excellence',
      link: '/shop?featured=true'
    };
  }

  return (
    <div
      onMouseLeave={onClose}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        zIndex: 900,
        padding: '2.5rem 0',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 1.2fr', gap: '3rem', alignItems: 'start' }}>
        {activeData.map((col, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '0.5rem',
              fontWeight: '700'
            }}>
              {col.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {col.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  to={item.path}
                  onClick={onClose}
                  style={{
                    fontSize: '0.9rem',
                    color: item.isHighlight ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                    fontWeight: item.isHighlight ? '600' : '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = item.isHighlight ? 'var(--accent-gold-hover)' : 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {item.isHighlight && <Sparkles size={14} color="var(--accent-gold)" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Featured Lookbook Card */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          aspectRatio: '16/10',
          boxShadow: 'var(--shadow-md)'
        }}>
          <img
            src={featuredBanner.image}
            alt={featuredBanner.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.75)',
              transition: 'transform var(--transition-slow)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: 'linear-gradient(to top, rgba(15,17,21,0.85), transparent 70%)',
            color: '#FFFFFF'
          }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
              {featuredBanner.subtitle}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0.25rem 0 0.75rem 0' }}>
              {featuredBanner.title}
            </h3>
            <Link
              to={featuredBanner.link}
              onClick={onClose}
              className="btn btn-sm btn-gold"
              style={{ width: 'fit-content', padding: '0.45rem 1rem' }}
            >
              Explore Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
