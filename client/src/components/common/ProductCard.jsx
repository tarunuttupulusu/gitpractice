import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');

  const isFavorited = isInWishlist(product._id);

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const currentImage = isHovered && product.images?.length > 1
    ? product.images[1]
    : product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80';

  const handleQuickAdd = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, selectedColor, 1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-normal)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/4',
        backgroundColor: 'var(--bg-secondary)',
        overflow: 'hidden'
      }}>
        <Link to={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={currentImage}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)'
            }}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 10 }}>
          {hasDiscount && (
            <span className="badge badge-sale">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-new">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="badge badge-bestseller">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="Save to Wishlist"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorited ? '#E53E3E' : 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 10,
            transition: 'all var(--transition-fast)'
          }}
        >
          <Heart size={18} fill={isFavorited ? '#E53E3E' : 'none'} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onQuickView) onQuickView(product);
          }}
          aria-label="Quick View"
          style={{
            position: 'absolute',
            bottom: isHovered ? '54px' : '-45px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 10,
            transition: 'all var(--transition-normal)'
          }}
        >
          <Eye size={18} />
        </button>

        {/* Quick Size Selector Bar (Slides in on hover) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 12px',
            backgroundColor: 'rgba(15, 17, 21, 0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform var(--transition-normal)',
            zIndex: 10
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em' }}>
            Quick Add:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {product.sizes?.slice(0, 5).map((s) => (
              <button
                key={s.size}
                disabled={s.stock === 0}
                onClick={(e) => handleQuickAdd(e, s.size)}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: s.stock === 0 ? '#666' : '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '3px',
                  textDecoration: s.stock === 0 ? 'line-through' : 'none'
                }}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {product.brand} • {product.category}
          </span>
          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
              <Star size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 style={{
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '2px'
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            ₹{price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color.name);
                }}
                title={color.name}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: color.hex,
                  border: selectedColor === color.name ? '2px solid var(--accent-gold)' : '1px solid #CCCCCC',
                  boxShadow: selectedColor === color.name ? '0 0 0 2px #FFFFFF' : 'none'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
