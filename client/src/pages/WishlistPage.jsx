import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product) => {
    addToCart(product, product.sizes?.[0]?.size || 'M', product.colors?.[0]?.name || 'Default', 1);
    toggleWishlist(product);
  };

  return (
    <div style={{ minHeight: '80vh', padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Saved Wishlist</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', marginBottom: '2.5rem' }}>
          MY SAVED WISHLIST ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Heart size={54} color="var(--border-medium)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '380px', margin: '0 auto 2rem auto' }}>
              Save garments you admire while exploring our seasonal lookbooks and sartorial edits.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Explore Collections <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {wishlist.map((product) => {
              const price = product.salePrice || product.price;

              return (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: 'var(--bg-secondary)' }}>
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <button
                      onClick={() => toggleWishlist(product)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#E53E3E'
                      }}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {product.brand} • {product.category}
                    </span>
                    <Link to={`/product/${product._id}`}>
                      <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-sans)', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0' }}>
                      ₹{(price || 0).toLocaleString()}
                    </span>

                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="btn btn-primary btn-sm btn-full"
                      style={{ marginTop: 'auto' }}
                    >
                      <ShoppingBag size={15} /> Move to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
