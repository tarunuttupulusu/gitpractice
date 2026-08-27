import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.size || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || 'Classic');
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const price = product.salePrice || product.price;
  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px', padding: '0', display: 'grid', gridTemplateColumns: '1fr 1.15fr', overflow: 'hidden' }}
      >
        {/* Left: Image gallery */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <img
            src={selectedImage || product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '380px' }}
          />

          {product.images?.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '6px'
            }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '36px',
                    height: '46px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: (selectedImage === img || (!selectedImage && idx === 0)) ? '2px solid var(--accent-gold)' : '1px solid #FFF'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product selection */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>

          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            {product.brand} • {product.category}
          </span>

          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>
            {product.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold-hover)', fontSize: '0.85rem' }}>
              <Star size={15} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <strong>{product.rating || 4.9}</strong>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              ({product.reviewCount || 12} Atelier reviews)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '0.25rem 0' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              ₹{price.toLocaleString()}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {product.description?.substring(0, 140)}...
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>
                Color: <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>{selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: selectedColor === c.name ? '2px solid var(--accent-gold)' : '1px solid #CCC',
                      boxShadow: selectedColor === c.name ? '0 0 0 2px #FFFFFF' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Select Size</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-hover)', cursor: 'pointer' }}>Size Guide</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      border: selectedSize === s.size ? '1.5px solid var(--bg-dark)' : '1px solid var(--border-light)',
                      backgroundColor: selectedSize === s.size ? 'var(--bg-dark)' : '#FFFFFF',
                      color: selectedSize === s.size ? '#FFFFFF' : 'var(--text-primary)',
                      borderRadius: '4px',
                      opacity: s.stock === 0 ? 0.4 : 1,
                      textDecoration: s.stock === 0 ? 'line-through' : 'none'
                    }}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.5rem 0.8rem', color: 'var(--text-secondary)' }}
              >
                -
              </button>
              <span style={{ padding: '0.5rem 0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0.5rem 0.8rem', color: 'var(--text-secondary)' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <ShoppingBag size={18} /> Add to Bag
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-outline"
              style={{ padding: '0.8rem' }}
              aria-label="Wishlist"
            >
              <Heart size={18} fill={isFavorited ? '#E53E3E' : 'none'} color={isFavorited ? '#E53E3E' : 'currentColor'} />
            </button>
          </div>

          <Link
            to={`/product/${product._id}`}
            onClick={onClose}
            style={{
              fontSize: '0.82rem',
              color: 'var(--accent-gold-hover)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '0.25rem'
            }}
          >
            View Full Atelier Specifications & Reviews <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
