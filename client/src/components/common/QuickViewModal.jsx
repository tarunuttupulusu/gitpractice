import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.size || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || 'Classic');
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const price = product.salePrice || product.price;
  const isFavorited = isInWishlist(product._id);
  const currentSizeObj = product.sizes?.find(s => s.size === selectedSize);
  const stockCount = currentSizeObj ? currentSizeObj.stock : 10;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '880px',
          padding: '0',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.2fr',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        {/* Left: Image gallery */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <img
            src={selectedImage || product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '440px', maxHeight: '520px' }}
          />

          {product.images?.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              padding: '0 1rem'
            }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '42px',
                    height: '52px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: (selectedImage === img || (!selectedImage && idx === 0)) ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.7)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    transition: 'transform var(--transition-fast)'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product selection */}
        <div style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>

          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-hover)', fontWeight: '700' }}>
              {product.brand} • {product.category}
            </span>

            <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', fontWeight: '700', marginTop: '4px' }}>
              {product.name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold-hover)', fontSize: '0.85rem' }}>
              <Star size={15} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <strong>{product.rating || 4.9}</strong>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              ({product.reviewCount || 14} Verified Atelier Reviews)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              ₹{price.toLocaleString()}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.price.toLocaleString()}
              </span>
            )}
            {stockCount > 0 && stockCount <= 5 && (
              <span className="badge" style={{ backgroundColor: '#FFF3E0', color: '#E65100', border: '1px solid #FFE0B2' }}>
                Only {stockCount} left in reserve
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {product.description?.substring(0, 150)}...
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Color: <span style={{ color: 'var(--accent-gold-hover)', fontWeight: '600' }}>{selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: selectedColor === c.name ? '2px solid var(--accent-gold)' : '1px solid #CCC',
                      boxShadow: selectedColor === c.name ? '0 0 0 2px #FFFFFF' : 'none',
                      transition: 'transform var(--transition-fast)'
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
                <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Select Size
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold-hover)', fontWeight: '600' }}>
                  Atelier Sizing Guide
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      border: selectedSize === s.size ? '1.5px solid var(--bg-dark)' : '1px solid var(--border-light)',
                      backgroundColor: selectedSize === s.size ? 'var(--bg-dark)' : '#FFFFFF',
                      color: selectedSize === s.size ? '#FFFFFF' : 'var(--text-primary)',
                      borderRadius: '2px',
                      opacity: s.stock === 0 ? 0.4 : 1,
                      textDecoration: s.stock === 0 ? 'line-through' : 'none',
                      transition: 'all var(--transition-fast)'
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
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '2px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.55rem 0.9rem', color: 'var(--text-secondary)', fontWeight: '700' }}
              >
                -
              </button>
              <span style={{ padding: '0.55rem 0.6rem', fontWeight: '700', fontSize: '0.9rem' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0.55rem 0.9rem', color: 'var(--text-secondary)', fontWeight: '700' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn ${addedSuccess ? 'btn-gold' : 'btn-primary'}`}
              style={{ flex: 1 }}
            >
              {addedSuccess ? (
                <>
                  <Check size={18} /> Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Atelier Bag
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-outline"
              style={{ padding: '0.85rem' }}
              aria-label="Wishlist"
            >
              <Heart size={18} fill={isFavorited ? '#D32F2F' : 'none'} color={isFavorited ? '#D32F2F' : 'currentColor'} />
            </button>
          </div>

          <Link
            to={`/product/${product._id}`}
            onClick={onClose}
            style={{
              fontSize: '0.82rem',
              color: 'var(--accent-gold-hover)',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '0.35rem'
            }}
          >
            Explore Full Sartorial Blueprint & Care Guide <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

