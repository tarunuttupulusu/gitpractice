import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Check,
  HelpCircle,
  Plus,
  Minus,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/common/ProductCard';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // UI state
  const [activeTab, setActiveTab] = useState('description');
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  // New Review Form
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setSelectedImage(data.data.images?.[0] || '');
          setSelectedSize(data.data.sizes?.[0]?.size || 'M');
          setSelectedColor(data.data.colors?.[0]?.name || 'Classic');

          // Fetch related
          const relRes = await fetch(`/api/products/${data.data._id}/related`);
          const relData = await relRes.json();
          if (relData.success) setRelatedProducts(relData.data || []);

          // Fetch reviews
          const revRes = await fetch(`/api/reviews/product/${data.data._id}`);
          const revData = await revRes.json();
          if (revData.success) setReviews(revData.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincodeInput.length === 6) {
      setPincodeStatus({
        available: true,
        date: 'Estimated Delivery in 2-3 Business Days via BlueDart Air Express'
      });
    } else {
      setPincodeStatus({
        available: false,
        date: 'Please enter a valid 6-digit Indian PIN code'
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('error', 'Please log in to submit a customer review');
      return;
    }
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('valenti_token');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          ...reviewForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setReviewForm({ rating: 5, title: '', comment: '' });
        showToast('success', 'Your review has been verified and published');
      } else {
        showToast('error', data.message);
      }
    } catch (err) {
      showToast('error', 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', minHeight: '80vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div style={{ aspectRatio: '3/4' }} className="skeleton" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: '30px', width: '60%' }} className="skeleton" />
            <div style={{ height: '40px', width: '40%' }} className="skeleton" />
            <div style={{ height: '120px' }} className="skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Garment Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Browse All Collections
        </Link>
      </div>
    );
  }

  const price = product.salePrice || product.price;
  const isFavorited = isInWishlist(product._id);
  const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize);
  const currentStock = selectedSizeObj ? selectedSizeObj.stock : product.stock;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/${product.gender}`} style={{ textTransform: 'capitalize' }}>{product.gender}</Link>
          <ChevronRight size={14} />
          <Link to={`/${product.gender}?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{product.name}</span>
        </div>

        {/* Top Section: Gallery + Product Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="product-details-grid">
          {/* Left: Multi-Image Zoom Gallery */}
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {/* Thumbnails list */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '80px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '80px',
                      height: '105px',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--accent-gold)' : '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Main Zoom Frame */}
            <div
              style={{
                flex: 1,
                aspectRatio: '3/4',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'crosshair'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.15s ease-out',
                  ...zoomStyle
                }}
              />
              {product.isOnSale && (
                <span className="badge badge-sale" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  SALE
                </span>
              )}
            </div>
          </div>

          {/* Right: Garment Specifications & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-gold-hover)', fontWeight: '700' }}>
                {product.brand} HAUTE COUTURE • {product.category.toUpperCase()}
              </span>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', marginTop: '0.35rem', lineHeight: '1.2' }}>
                {product.name}
              </h1>

              {/* Ratings and reviews summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold-hover)', fontWeight: '700', fontSize: '0.9rem' }}>
                  <Star size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
                  <span>{product.rating || 4.9}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  ({reviews.length || product.reviewCount || 1} verified customer reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              padding: '1rem 0',
              borderTop: '1px solid var(--border-light)',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                ₹{price.toLocaleString()}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="badge badge-sale">
                    Save ₹{(product.price - product.salePrice).toLocaleString()}
                  </span>
                </>
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                Inclusive of all taxes & duties
              </span>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                  Color: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor}</strong>
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: selectedColor === c.name ? '2px solid var(--accent-gold)' : '1px solid #CCCCCC',
                        boxShadow: selectedColor === c.name ? '0 0 0 3px #FFFFFF' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                    Select Size: <strong style={{ color: 'var(--text-primary)' }}>{selectedSize}</strong>
                  </p>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    style={{ fontSize: '0.82rem', color: 'var(--accent-gold-hover)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <HelpCircle size={14} /> Atelier Size Guide
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      disabled={s.stock === 0}
                      onClick={() => setSelectedSize(s.size)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        border: selectedSize === s.size ? '2px solid var(--bg-dark)' : '1px solid var(--border-light)',
                        backgroundColor: selectedSize === s.size ? 'var(--bg-dark)' : '#FFFFFF',
                        color: selectedSize === s.size ? '#FFFFFF' : 'var(--text-primary)',
                        borderRadius: '4px',
                        opacity: s.stock === 0 ? 0.35 : 1,
                        textDecoration: s.stock === 0 ? 'line-through' : 'none'
                      }}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>

                {/* Stock Indicator */}
                <p style={{ fontSize: '0.8rem', color: currentStock <= 5 ? '#E53E3E' : 'var(--accent-emerald)', marginTop: '8px', fontWeight: '600' }}>
                  {currentStock <= 5
                    ? `⚠️ Only ${currentStock} pieces left in atelier inventory.`
                    : `✓ In Stock: Ready for dispatch within 24 hours.`}
                </p>
              </div>
            )}

            {/* Quantity Selector & Action CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '4px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0.8rem 0.6rem', fontWeight: '700', fontSize: '1rem', minWidth: '36px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={18} /> Add to Bag
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn btn-outline"
                  style={{ padding: '0 1.25rem' }}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={isFavorited ? '#E53E3E' : 'none'} color={isFavorited ? '#E53E3E' : 'currentColor'} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="btn btn-gold btn-full"
              >
                Buy It Now (Express Checkout)
              </button>
            </div>

            {/* Pincode Estimator */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                <MapPin size={16} color="var(--accent-gold)" /> Check Atelier Delivery & Pincode
              </div>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code..."
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  className="form-input"
                  style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-sm btn-outline">Check</button>
              </form>
              {pincodeStatus && (
                <p style={{ fontSize: '0.8rem', color: pincodeStatus.available ? 'var(--accent-emerald)' : '#E53E3E', marginTop: '6px', fontWeight: '500' }}>
                  {pincodeStatus.date}
                </p>
              )}
            </div>

            {/* Guarantee badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div>
                <Truck size={18} color="var(--accent-gold)" style={{ margin: '0 auto 4px auto' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Complimentary Shipping</p>
              </div>
              <div>
                <RotateCcw size={18} color="var(--accent-gold)" style={{ margin: '0 auto 4px auto' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>14-Day Doorstep Returns</p>
              </div>
              <div>
                <ShieldCheck size={18} color="var(--accent-gold)" style={{ margin: '0 auto 4px auto' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>100% Certified Luxury</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Customer Reviews */}
        <div style={{ marginTop: '5rem', borderTop: '1px solid var(--border-light)', paddingTop: '3rem' }}>
          {/* Tabs header */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem', marginBottom: '2.5rem' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                fontSize: '1rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: activeTab === 'description' ? '700' : '400',
                color: activeTab === 'description' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'description' ? '2px solid var(--accent-gold)' : 'none',
                paddingBottom: '0.85rem',
                marginBottom: '-0.85rem'
              }}
            >
              Atelier Details & Silhouette
            </button>
            <button
              onClick={() => setActiveTab('material')}
              style={{
                fontSize: '1rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: activeTab === 'material' ? '700' : '400',
                color: activeTab === 'material' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'material' ? '2px solid var(--accent-gold)' : 'none',
                paddingBottom: '0.85rem',
                marginBottom: '-0.85rem'
              }}
            >
              Fabric & Sartorial Care
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                fontSize: '1rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: activeTab === 'reviews' ? '700' : '400',
                color: activeTab === 'reviews' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-gold)' : 'none',
                paddingBottom: '0.85rem',
                marginBottom: '-0.85rem'
              }}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab 1: Description & Specs */}
          {activeTab === 'description' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                {product.description}
              </p>

              {product.specifications && product.specifications.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Garment Blueprint & Tailoring Specs
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {product.specifications.map((spec, i) => (
                      <div key={i} style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{spec.key}</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Material & Care */}
          {activeTab === 'material' && (
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Natural Fiber Composition
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  {product.material}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Preservation & Laundering Instructions
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  {product.careInstructions}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }} className="reviews-grid">
              {/* Existing Reviews List */}
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                  Client Feedback ({reviews.length})
                </h3>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No reviews yet. Be the first to share your thoughts on this atelier piece!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {reviews.map((rev) => (
                      <div key={rev._id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '0.9rem' }}>{rev.userName}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Check size={12} /> Verified Connoisseur
                            </span>
                          </div>
                          <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '4px 0' }}>{rev.title}</h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Review Form */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-sm)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Write an Atelier Review</h3>
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Rating</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          style={{ color: star <= reviewForm.rating ? 'var(--accent-gold)' : 'var(--border-medium)' }}
                        >
                          <Star size={22} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Review Headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Exceptional fit and fabric roll"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Your Commentary</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the drape, fit, and sartorial feel..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn btn-primary btn-full"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '6rem' }}>
            <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              COMPLETE THE ATELIER ENSEMBLE
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="modal-backdrop" onClick={() => setShowSizeGuide(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>ATELIER SIZE CHART & MEASUREMENTS</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              All measurements are tailored to European sartorial standards. Values listed in inches.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '8px' }}>Size</th>
                  <th style={{ padding: '8px' }}>Chest</th>
                  <th style={{ padding: '8px' }}>Waist</th>
                  <th style={{ padding: '8px' }}>Shoulder</th>
                  <th style={{ padding: '8px' }}>Sleeve</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px', fontWeight: '700' }}>38 / S</td>
                  <td style={{ padding: '8px' }}>38" - 39"</td>
                  <td style={{ padding: '8px' }}>31" - 32"</td>
                  <td style={{ padding: '8px' }}>17.5"</td>
                  <td style={{ padding: '8px' }}>25.5"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px', fontWeight: '700' }}>40 / M</td>
                  <td style={{ padding: '8px' }}>40" - 41"</td>
                  <td style={{ padding: '8px' }}>33" - 34"</td>
                  <td style={{ padding: '8px' }}>18.2"</td>
                  <td style={{ padding: '8px' }}>26.0"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px', fontWeight: '700' }}>42 / L</td>
                  <td style={{ padding: '8px' }}>42" - 43"</td>
                  <td style={{ padding: '8px' }}>35" - 36"</td>
                  <td style={{ padding: '8px' }}>19.0"</td>
                  <td style={{ padding: '8px' }}>26.5"</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: '700' }}>44 / XL</td>
                  <td style={{ padding: '8px' }}>44" - 45"</td>
                  <td style={{ padding: '8px' }}>37" - 38"</td>
                  <td style={{ padding: '8px' }}>19.8"</td>
                  <td style={{ padding: '8px' }}>27.0"</td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => setShowSizeGuide(false)} className="btn btn-primary btn-full" style={{ marginTop: '2rem' }}>
              Close Size Guide
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .product-details-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsPage;
