import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';
import Review from './models/Review.js';
import { connectDB } from './config/db.js';

dotenv.config();

const categoriesData = [
  {
    name: 'Shirts',
    slug: 'shirts',
    gender: 'men',
    description: 'Bespoke sartorial luxury shirts tailored from Egyptian Giza cotton and French linen.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    subcategories: [
      { name: 'Formal Shirts', slug: 'formal-shirts', description: 'Impeccable collar designs for boardroom elegance' },
      { name: 'Casual Shirts', slug: 'casual-shirts', description: 'Relaxed linen and brushed cotton weaves' },
      { name: 'Party Wear', slug: 'party-wear', description: 'Silky satin finishes and subtle jacquard motifs' }
    ]
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    gender: 'men',
    description: 'Ultra-fine Supima cotton tees and knitted polos.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    subcategories: [
      { name: 'Polo', slug: 'polo', description: 'Mercerized pique knit polos' },
      { name: 'Solid', slug: 'solid', description: 'Timeless minimal essentials' },
      { name: 'Graphic', slug: 'graphic', description: 'Artisanal abstract screenprints' }
    ]
  },
  {
    name: 'Blazers & Suits',
    slug: 'blazers',
    gender: 'men',
    description: 'Italian tailored wool blazers, tuxedo jackets, and two-piece suits.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    subcategories: [
      { name: 'Formal Blazers', slug: 'formal-blazers', description: 'Super 130s wool structured jackets' },
      { name: 'Casual Blazers', slug: 'casual-blazers', description: 'Unstructured linen-silk blends' }
    ]
  },
  {
    name: 'Trousers & Chinos',
    slug: 'trousers',
    gender: 'men',
    description: 'Pleated wool trousers, tailored gurkha pants, and stretch stretch chinos.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    subcategories: [
      { name: 'Formal Trousers', slug: 'formal-trousers', description: 'Tailored crease trousers' },
      { name: 'Chinos', slug: 'chinos', description: 'Smart casual washed cotton chinos' }
    ]
  },
  {
    name: 'Jeans',
    slug: 'jeans-men',
    gender: 'men',
    description: 'Japanese Kurabo selvedge denim in refined vintage washes.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    subcategories: [
      { name: 'Slim Fit', slug: 'slim-fit', description: 'Tapered luxury denim' },
      { name: 'Straight Fit', slug: 'straight-fit', description: 'Classic heritage cut' },
      { name: 'Selvedge', slug: 'selvedge', description: 'Japanese shuttle loom red-line selvedge' }
    ]
  },
  {
    name: 'Knitwear',
    slug: 'knitwear-men',
    gender: 'men',
    description: 'Mongolian pure cashmere and extra-fine Italian merino knitwear.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    subcategories: [
      { name: 'Cashmere Knitwear', slug: 'cashmere-knitwear', description: 'Grade-A pure Mongolian cashmere' },
      { name: 'Merino Sweaters', slug: 'merino-sweaters', description: 'Extra fine 19.5 micron merino wool' },
      { name: 'Cardigans', slug: 'cardigans', description: 'Bespoke buttoned and shawl cardigans' }
    ]
  },
  // WOMEN CATEGORIES
  {
    name: 'Dresses',
    slug: 'dresses',
    gender: 'women',
    description: 'Couture evening gowns, silk midi slips, and structured blazer dresses.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    subcategories: [
      { name: 'Evening Gowns', slug: 'evening-gowns', description: 'Floor length silk and velvet silhouettes' },
      { name: 'Midi Dresses', slug: 'midi-dresses', description: 'Effortless daytime sophistication' },
      { name: 'Blazer Dresses', slug: 'blazer-dresses', description: 'Sharp tailored femininity' }
    ]
  },
  {
    name: 'Tops & Shirts',
    slug: 'tops',
    gender: 'women',
    description: 'Fluid mulberry silk blouses, organza shirts, and structured corset tops.',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
    subcategories: [
      { name: 'Silk Blouses', slug: 'silk-blouses', description: 'Draped 100% mulberry silk' },
      { name: 'Formal Shirts', slug: 'formal-shirts-women', description: 'Crisp poplin tailored collars' }
    ]
  },
  {
    name: 'Blazers & Outerwear',
    slug: 'blazers-women',
    gender: 'women',
    description: 'Double-breasted power blazers and cashmere wrap coats.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    subcategories: [
      { name: 'Tailored Blazers', slug: 'tailored-blazers', description: 'Hourglass and oversized structured cuts' },
      { name: 'Trench Coats', slug: 'trench-coats', description: 'Waterproof gabardine luxury trench' }
    ]
  },
  {
    name: 'Trousers & Skirts',
    slug: 'trousers-women',
    gender: 'women',
    description: 'Wide-leg pleated palazzo trousers and satin bias-cut skirts.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    subcategories: [
      { name: 'Wide-Leg Trousers', slug: 'wide-leg', description: 'High-waisted draped silhouette' },
      { name: 'Satin Skirts', slug: 'satin-skirts', description: 'Liquid silk drape' }
    ]
  }
];

const productsData = [
  // ==========================================
  // MEN: SHIRTS & TOPS - FORMAL SHIRTS
  // ==========================================
  {
    name: 'Milano Royal Oxford Formal Shirt',
    slug: 'milano-royal-oxford-formal-shirt',
    brand: 'VALENTI',
    description: 'Woven from two-ply 100% Egyptian Giza 87 cotton, this royal oxford shirt offers a lustrous sheen, mother-of-pearl buttons, and a crisp semi-cutaway collar engineered for effortless tie pairing.',
    category: 'Shirts',
    subcategory: 'Formal Shirts',
    gender: 'men',
    price: 3499,
    salePrice: 2799,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?w=1000&q=80'
    ],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF', inStock: true },
      { name: 'Sky Azure', hex: '#A4C8E1', inStock: true },
      { name: 'Midnight Navy', hex: '#1B263B', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 12 },
      { size: '40', stock: 18 },
      { size: '42', stock: 15 },
      { size: '44', stock: 8 }
    ],
    material: '100% Egyptian Giza 87 Compact Cotton (140/2 ply)',
    careInstructions: 'Machine wash warm with like colors. Warm iron while slightly damp. Dry clean recommended.',
    specifications: [
      { key: 'Fit', value: 'Contemporary Tailored Fit' },
      { key: 'Collar', value: 'Semi-Spread Cutaway Collar' },
      { key: 'Cuff', value: 'Double Button Chiseled Barrel Cuff' },
      { key: 'Buttons', value: 'Genuine Australian Mother of Pearl' }
    ],
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Florentine Fine Twill Spread-Collar Shirt',
    slug: 'florentine-fine-twill-spread-collar-shirt',
    brand: 'VALENTI',
    description: 'A masterpiece of Italian shirting. Tailored from 120s compact diagonal twill with exceptional wrinkle resistance, a generous Italian spread collar, and hand-turned single-needle stitching.',
    category: 'Shirts',
    subcategory: 'Formal Shirts',
    gender: 'men',
    price: 3699,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=1000&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=80'
    ],
    colors: [
      { name: 'Pale French Blue', hex: '#C6D9E8', inStock: true },
      { name: 'Classic White', hex: '#FFFFFF', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 14 },
      { size: '40', stock: 20 },
      { size: '42', stock: 16 },
      { size: '44', stock: 10 }
    ],
    material: '100% Extra-Long Staple Italian Cotton Twill',
    careInstructions: 'Machine wash 40°C. Steam iron.',
    specifications: [
      { key: 'Fit', value: 'Slim Sartorial Silhouette' },
      { key: 'Collar', value: 'Full Italian Spread Collar' },
      { key: 'Placket', value: 'Clean Seamless French Front' }
    ],
    rating: 4.8,
    reviewCount: 31,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Venetian French-Cuff Tuxedo Shirt',
    slug: 'venetian-french-cuff-tuxedo-shirt',
    brand: 'VALENTI',
    description: 'Black tie perfection. Features a classic pleated marcella bib front, removable stud fasteners, and double French cuffs designed for bespoke cufflinks.',
    category: 'Shirts',
    subcategory: 'Formal Shirts',
    gender: 'men',
    price: 4599,
    salePrice: 3899,
    images: [
      'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=1000&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=80'
    ],
    colors: [
      { name: 'Pure Alabaster', hex: '#FDFBF7', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 8 },
      { size: '40', stock: 15 },
      { size: '42', stock: 12 },
      { size: '44', stock: 6 }
    ],
    material: '100% Giza 45 Marcella Pique & Poplin Body',
    careInstructions: 'Dry clean or delicate wash. Starch collar and bib.',
    specifications: [
      { key: 'Collar', value: 'Formal Wing / Turn-Down Hybrid' },
      { key: 'Cuffs', value: 'Double French Cuffs' },
      { key: 'Bib', value: 'Hand-Pleated Marcella' }
    ],
    rating: 5.0,
    reviewCount: 18,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    name: 'Savile Row Fine Bengal Stripe Shirt',
    slug: 'savile-row-fine-bengal-stripe-shirt',
    brand: 'VALENTI',
    description: 'Classic British sartorial heritage. Navy and white alternating fine Bengal stripes woven on high-density looms with contrasting white semi-spread collar and cuffs.',
    category: 'Shirts',
    subcategory: 'Formal Shirts',
    gender: 'men',
    price: 3799,
    salePrice: 3199,
    images: [
      'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=80'
    ],
    colors: [
      { name: 'Navy & White Stripe', hex: '#1E3A8A', inStock: true },
      { name: 'Bordeaux & White Stripe', hex: '#881337', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 10 },
      { size: '40', stock: 16 },
      { size: '42', stock: 14 },
      { size: '44', stock: 7 }
    ],
    material: '100% 2-Ply Long Staple Egyptian Cotton',
    careInstructions: 'Machine wash warm. Medium iron.',
    specifications: [
      { key: 'Pattern', value: 'Yarn-Dyed 2mm Bengal Stripe' },
      { key: 'Collar', value: 'White Contrast Semi-Cutaway' }
    ],
    rating: 4.8,
    reviewCount: 22,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },

  // ==========================================
  // MEN: SHIRTS & TOPS - CASUAL LINEN SHIRTS
  // ==========================================
  {
    name: 'Sartorial Linen Band-Collar Shirt',
    slug: 'sartorial-linen-band-collar-shirt',
    brand: 'VALENTI',
    description: 'Crafted from masterfully airy Normandy French flax linen, garment-washed for a silky hand-feel and finished with hand-carved horn buttons.',
    category: 'Shirts',
    subcategory: 'Casual Shirts',
    gender: 'men',
    price: 3999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&q=80'
    ],
    colors: [
      { name: 'Raw Sand', hex: '#D2B48C', inStock: true },
      { name: 'Sage Olive', hex: '#556B2F', inStock: true },
      { name: 'Ivory Cream', hex: '#FFFFF0', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 10 },
      { size: '40', stock: 14 },
      { size: '42', stock: 12 },
      { size: '44', stock: 6 }
    ],
    material: '100% Certified Normandy Flax Linen',
    careInstructions: 'Hand wash or gentle machine wash in cold water. Hang dry in shade.',
    specifications: [
      { key: 'Fit', value: 'Relaxed Tailored Fit' },
      { key: 'Collar', value: 'Mandarin Band Collar' },
      { key: 'Weave', value: 'Open Airy Plain Weave' }
    ],
    rating: 4.8,
    reviewCount: 28,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Saint-Tropez Camp-Collar Resort Shirt',
    slug: 'saint-tropez-camp-collar-resort-shirt',
    brand: 'VALENTI',
    description: 'Inspired by the French Riviera. A breezy cuban-collar short sleeve shirt tailored in lightweight textured slub linen, perfect for warm Mediterranean days.',
    category: 'Shirts',
    subcategory: 'Casual Shirts',
    gender: 'men',
    price: 3299,
    salePrice: 2699,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=80'
    ],
    colors: [
      { name: 'Terracotta Rust', hex: '#C85A32', inStock: true },
      { name: 'Mediterranean Azure', hex: '#2B6CB0', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 12 },
      { size: '40', stock: 18 },
      { size: '42', stock: 15 },
      { size: '44', stock: 8 }
    ],
    material: '100% Garment-Washed Pure Linen (155 GSM)',
    careInstructions: 'Machine wash cold. Do not bleach. Line dry in shade.',
    specifications: [
      { key: 'Collar', value: 'Cuban Open Camp Collar' },
      { key: 'Hem', value: 'Straight Hem with Side Vents' }
    ],
    rating: 4.9,
    reviewCount: 25,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Amalfi Coast Garment-Dyed Chambray Shirt',
    slug: 'amalfi-coast-garment-dyed-chambray-shirt',
    brand: 'VALENTI',
    description: 'Spun from Japanese organic cotton-linen chambray. Each piece is artisanal garment-dyed in small batches for a lived-in depth of color.',
    category: 'Shirts',
    subcategory: 'Casual Shirts',
    gender: 'men',
    price: 3799,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&q=80'
    ],
    colors: [
      { name: 'Washed Indigo', hex: '#3B5998', inStock: true },
      { name: 'Dusty Moss', hex: '#4A5D4E', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 9 },
      { size: '40', stock: 15 },
      { size: '42', stock: 11 },
      { size: '44', stock: 5 }
    ],
    material: '60% Organic Cotton, 40% Normandy Flax Linen',
    careInstructions: 'Machine wash gentle cycle cold.',
    specifications: [
      { key: 'Buttons', value: 'Real Corozo Nut Buttons' },
      { key: 'Fit', value: 'Modern Tailored Casual' }
    ],
    rating: 4.7,
    reviewCount: 19,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false
  },

  // ==========================================
  // MEN: SHIRTS & TOPS - EVENING & PARTY WEAR
  // ==========================================
  {
    name: 'Obsidian Pure Silk Jacquard Evening Shirt',
    slug: 'obsidian-pure-silk-jacquard-evening-shirt',
    brand: 'VALENTI',
    description: 'Designed for VIP gala evenings. Tailored from 100% 19-momme mulberry silk with an intricate tonal micro-geometric jacquard weave and hidden placket.',
    category: 'Shirts',
    subcategory: 'Party Wear',
    gender: 'men',
    price: 5499,
    salePrice: 4499,
    images: [
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1000&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1000&q=80',
      'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=1000&q=80'
    ],
    colors: [
      { name: 'Obsidian Noir', hex: '#0A0B0D', inStock: true },
      { name: 'Imperial Emerald', hex: '#0B3B2B', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 8 },
      { size: '40', stock: 14 },
      { size: '42', stock: 12 },
      { size: '44', stock: 6 }
    ],
    material: '100% Pure Mulberry Silk Jacquard (19 Momme)',
    careInstructions: 'Specialist dry clean only.',
    specifications: [
      { key: 'Placket', value: 'Concealed Fly Front' },
      { key: 'Collar', value: 'Structured Milano Evening Collar' }
    ],
    rating: 5.0,
    reviewCount: 26,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Midnight Satin Cocktail Dress Shirt',
    slug: 'midnight-satin-cocktail-dress-shirt',
    brand: 'VALENTI',
    description: 'High-sheen cotton-silk satin weave offering a fluid silhouette and liquid luster under low ambient evening lights.',
    category: 'Shirts',
    subcategory: 'Party Wear',
    gender: 'men',
    price: 4299,
    salePrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1000&q=80',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1000&q=80',
      'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=1000&q=80'
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#111827', inStock: true },
      { name: 'Deep Burgundy', hex: '#4A0E17', inStock: true }
    ],
    sizes: [
      { size: '38', stock: 10 },
      { size: '40', stock: 15 },
      { size: '42', stock: 12 },
      { size: '44', stock: 7 }
    ],
    material: '70% Egyptian Cotton, 30% Mulberry Silk',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Weave', value: 'High Density Silk Satin' },
      { key: 'Cuffs', value: 'Angled Single-Button Cuffs' }
    ],
    rating: 4.9,
    reviewCount: 20,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },

  // ==========================================
  // MEN: T-SHIRTS - SUPIMA POLOS
  // ==========================================
  {
    name: 'Supima Silk-Touch Pique Polo',
    slug: 'supima-silk-touch-pique-polo',
    brand: 'VALENTI',
    description: 'Double-mercerized long-staple Supima cotton gives this polo a liquid silk luster, resilient structure, and non-curling knit collar.',
    category: 'T-Shirts',
    subcategory: 'Polo',
    gender: 'men',
    price: 2499,
    salePrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=80'
    ],
    colors: [
      { name: 'Forest Emerald', hex: '#1C3F3A', inStock: true },
      { name: 'Burgundy Wine', hex: '#58111A', inStock: true },
      { name: 'Jet Black', hex: '#101010', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 12 }
    ],
    material: '100% American Supima Cotton (Double Mercerized)',
    careInstructions: 'Machine wash cold. Reshape and dry flat.',
    specifications: [
      { key: 'Placket', value: 'Hidden 3-Button Placket' },
      { key: 'Weight', value: '220 GSM Dense Pique' }
    ],
    rating: 4.8,
    reviewCount: 35,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Riviera Knitted Johnny-Collar Polo',
    slug: 'riviera-knitted-johnny-collar-polo',
    brand: 'VALENTI',
    description: 'Inspired by 1960s Italian resort wear. Knitted from ultra-fine 14-gauge Giza cotton with a buttonless Johnny collar and ribbed retro cuffs.',
    category: 'T-Shirts',
    subcategory: 'Polo',
    gender: 'men',
    price: 3299,
    salePrice: 2699,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=80',
      'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=1000&q=80'
    ],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D7D2C8', inStock: true },
      { name: 'Navy Nautical', hex: '#1C2E4A', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 16 },
      { size: 'XL', stock: 8 }
    ],
    material: '100% 14-Gauge Long-Staple Combed Giza Cotton',
    careInstructions: 'Hand wash cold or dry clean.',
    specifications: [
      { key: 'Collar', value: 'Buttonless Open Johnny Collar' },
      { key: 'Knit', value: 'Full Fashioned Milanese Knit' }
    ],
    rating: 4.9,
    reviewCount: 29,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },

  // ==========================================
  // MEN: T-SHIRTS - SOLID LUXURY TEES
  // ==========================================
  {
    name: '280 GSM Heavyweight Supima Crewneck Tee',
    slug: '280-gsm-heavyweight-supima-crewneck-tee',
    brand: 'VALENTI',
    description: 'The definitive luxury heavyweight t-shirt. Crafted from 280 GSM combed Supima jersey with a bound 1-inch ribbed neck that never stretches out.',
    category: 'T-Shirts',
    subcategory: 'Solid',
    gender: 'men',
    price: 1899,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=80'
    ],
    colors: [
      { name: 'Optic White', hex: '#FFFFFF', inStock: true },
      { name: 'Heavy Obsidian', hex: '#0D0F12', inStock: true },
      { name: 'Warm Cashmere Grey', hex: '#9E9D99', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 35 },
      { size: 'L', stock: 30 },
      { size: 'XL', stock: 15 }
    ],
    material: '100% Supima Long-Staple Cotton (280 GSM)',
    careInstructions: 'Machine wash cold inside out. Hang dry.',
    specifications: [
      { key: 'Collar', value: 'Reinforced 1-inch Heavy Ribbed Collar' },
      { key: 'Fit', value: 'Relaxed Tailored Boxy Silhouette' }
    ],
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Minimalist Raw-Edge Modal Relaxed Tee',
    slug: 'minimalist-raw-edge-modal-relaxed-tee',
    brand: 'VALENTI',
    description: 'An ultra-soft, fluid drape blend of micro-modal and Peruvian Pima cotton with raw-cut hems for an effortless quiet luxury aesthetic.',
    category: 'T-Shirts',
    subcategory: 'Solid',
    gender: 'men',
    price: 2199,
    salePrice: 1799,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80'
    ],
    colors: [
      { name: 'Washed Charcoal', hex: '#2C3038', inStock: true },
      { name: 'Desert Sand', hex: '#C2B8A3', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 14 },
      { size: 'M', stock: 22 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 9 }
    ],
    material: '50% Austrian Micro-Modal, 50% Peruvian Pima Cotton',
    careInstructions: 'Machine wash delicate cold.',
    specifications: [
      { key: 'Edge', value: 'Artisanal Clean Raw Cut' },
      { key: 'Weight', value: '170 GSM Lightweight Fluid' }
    ],
    rating: 4.8,
    reviewCount: 24,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },

  // ==========================================
  // MEN: SUITS & TAILORING - BLAZERS & SUITS
  // ==========================================
  {
    name: 'Merino Wool Double-Breasted Blazer',
    slug: 'merino-wool-double-breasted-blazer',
    brand: 'VALENTI',
    description: 'An icon of contemporary power tailoring. Tailored from pure Super 140s Italian merino wool with wide peak lapels, floating canvas construction, and horn buttons.',
    category: 'Blazers & Suits',
    subcategory: 'Formal Blazers',
    gender: 'men',
    price: 14999,
    salePrice: 12499,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=80'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0B0B0C', inStock: true },
      { name: 'Charcoal Houndstooth', hex: '#36454F', inStock: true }
    ],
    sizes: [
      { size: '38R', stock: 6 },
      { size: '40R', stock: 10 },
      { size: '42R', stock: 8 },
      { size: '44R', stock: 4 }
    ],
    material: '100% Super 140s Biella Italian Merino Wool',
    careInstructions: 'Specialist dry clean only. Steam gently.',
    specifications: [
      { key: 'Construction', value: 'Half Canvas with Hand-Stitched Pick Lapel' },
      { key: 'Lapel', value: '11cm Bold Peak Lapel' },
      { key: 'Lining', value: 'Cupro Bemberg Jacquard' }
    ],
    rating: 5.0,
    reviewCount: 19,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Napoli Super 150s Hopsack Navy Blazer',
    slug: 'napoli-super-150s-hopsack-navy-blazer',
    brand: 'VALENTI',
    description: 'The quintessential sartorial jacket. Woven in an open hopsack weave for year-round breathability, finished with patch pockets, natural Neapolitan shoulders, and mother of pearl buttons.',
    category: 'Blazers & Suits',
    subcategory: 'Formal Blazers',
    gender: 'men',
    price: 16499,
    salePrice: 13999,
    images: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80',
      'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=1000&q=80'
    ],
    colors: [
      { name: 'Royal Navy', hex: '#1B2A4A', inStock: true }
    ],
    sizes: [
      { size: '38R', stock: 8 },
      { size: '40R', stock: 12 },
      { size: '42R', stock: 10 },
      { size: '44R', stock: 5 }
    ],
    material: '100% Super 150s Vitale Barberis Canonico Wool',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Shoulder', value: 'Spalla Camicia Neapolitan Shirring' },
      { key: 'Pockets', value: 'Curved Barchetta Chest & Patch Pockets' }
    ],
    rating: 4.9,
    reviewCount: 32,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Florentine Unstructured Silk-Linen Blazer',
    slug: 'florentine-unstructured-silk-linen-blazer',
    brand: 'VALENTI',
    description: 'Featherlight summer luxury. Free from heavy shoulder padding and internal canvas, tailored from an opulent blend of raw tussar silk and Irish linen.',
    category: 'Blazers & Suits',
    subcategory: 'Casual Blazers',
    gender: 'men',
    price: 13499,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=80'
    ],
    colors: [
      { name: 'Tuscan Tan', hex: '#A88B6E', inStock: true },
      { name: 'Cream Alabaster', hex: '#F5F5DC', inStock: true }
    ],
    sizes: [
      { size: '38R', stock: 6 },
      { size: '40R', stock: 10 },
      { size: '42R', stock: 8 },
      { size: '44R', stock: 4 }
    ],
    material: '55% Irish Linen, 45% Raw Mulberry Silk',
    careInstructions: 'Dry clean recommended.',
    specifications: [
      { key: 'Structure', value: 'Completely Unlined & Deconstructed' },
      { key: 'Buttons', value: 'Hand-Polished Horn Buttons' }
    ],
    rating: 4.8,
    reviewCount: 15,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Double-Breasted Camel Hair Power Jacket',
    slug: 'double-breasted-camel-hair-power-jacket',
    brand: 'VALENTI',
    description: 'Woven from pure baby camel hair from Inner Mongolia, offering an extraordinarily soft thermal touch, 6x2 button stance, and hand-rolled lapels.',
    category: 'Blazers & Suits',
    subcategory: 'Double-Breasted',
    gender: 'men',
    price: 18999,
    salePrice: 15999,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1000&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80'
    ],
    colors: [
      { name: 'Rich Camel', hex: '#C19A6B', inStock: true }
    ],
    sizes: [
      { size: '38R', stock: 4 },
      { size: '40R', stock: 8 },
      { size: '42R', stock: 6 },
      { size: '44R', stock: 3 }
    ],
    material: '100% Pure Mongolian Baby Camel Hair',
    careInstructions: 'Specialist dry clean only.',
    specifications: [
      { key: 'Stance', value: 'Classic 6-on-2 Double-Breasted' },
      { key: 'Vents', value: 'Double Side Vents' }
    ],
    rating: 5.0,
    reviewCount: 12,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },

  // ==========================================
  // MEN: SUITS & TAILORING - TROUSERS & CHINOS
  // ==========================================
  {
    name: 'Gurkha Pleated Flannel Trousers',
    slug: 'gurkha-pleated-flannel-trousers',
    brand: 'VALENTI',
    description: 'Featuring double inward pleats and an extended waistband with twin brass buckles. Tailored from soft winter wool flannel.',
    category: 'Trousers & Chinos',
    subcategory: 'Formal Trousers',
    gender: 'men',
    price: 4999,
    salePrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&q=80'
    ],
    colors: [
      { name: 'Taupe Grey', hex: '#8B8589', inStock: true },
      { name: 'Espresso Brown', hex: '#3B2F2F', inStock: true }
    ],
    sizes: [
      { size: '30', stock: 8 },
      { size: '32', stock: 16 },
      { size: '34', stock: 14 },
      { size: '36', stock: 6 }
    ],
    material: '90% Wool, 10% Cashmere blend',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Closure', value: 'Adjustable Side Gurkha Fasteners' },
      { key: 'Hem', value: '2-inch Turn-Up Cuff' }
    ],
    rating: 4.9,
    reviewCount: 15,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Sartorial Double-Pleat Wide Leg Trousers',
    slug: 'sartorial-double-pleat-wide-leg-trousers',
    brand: 'VALENTI',
    description: 'High-rise silhouette with deep forward pleats, side adjusters, and a relaxed taper tailored in Italian tropical fresco wool.',
    category: 'Trousers & Chinos',
    subcategory: 'Formal Trousers',
    gender: 'men',
    price: 5299,
    salePrice: 4299,
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=80',
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=1000&q=80'
    ],
    colors: [
      { name: 'Flint Charcoal', hex: '#2A2D34', inStock: true },
      { name: 'Sand Khaki', hex: '#C3B091', inStock: true }
    ],
    sizes: [
      { size: '30', stock: 10 },
      { size: '32', stock: 18 },
      { size: '34', stock: 15 },
      { size: '36', stock: 8 }
    ],
    material: '100% High-Twist Fresco Wool (280 GSM)',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Rise', value: 'High Sartorial Rise' },
      { key: 'Waistband', value: 'Clean Extended Tab with Side Buckles' }
    ],
    rating: 4.8,
    reviewCount: 22,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Supima Cotton Tailored Stretch Chinos',
    slug: 'supima-cotton-tailored-stretch-chinos',
    brand: 'VALENTI',
    description: 'Refined casual versatility. Tailored from silky American Supima cotton with 2% elastane for subtle flex, pick-stitched fly, and horn buttons.',
    category: 'Trousers & Chinos',
    subcategory: 'Chinos',
    gender: 'men',
    price: 3499,
    salePrice: 2899,
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=80'
    ],
    colors: [
      { name: 'British Khaki', hex: '#BDB76B', inStock: true },
      { name: 'Olive Green', hex: '#556B2F', inStock: true },
      { name: 'Navy Blue', hex: '#1B263B', inStock: true }
    ],
    sizes: [
      { size: '30', stock: 12 },
      { size: '32', stock: 24 },
      { size: '34', stock: 20 },
      { size: '36', stock: 10 }
    ],
    material: '98% Supima Cotton, 2% Lycra Elastane',
    careInstructions: 'Machine wash cold inside-out. Medium iron.',
    specifications: [
      { key: 'Fit', value: 'Slim Tapered Leg' },
      { key: 'Finish', value: 'Brushed Peach Satin Finish' }
    ],
    rating: 4.9,
    reviewCount: 40,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },

  // ==========================================
  // MEN: DENIM & CASUALS - JEANS & DENIM
  // ==========================================
  {
    name: 'Selvedge Raw Kurabo Denim Jeans',
    slug: 'selvedge-raw-kurabo-denim-jeans',
    brand: 'VALENTI',
    description: '14.5oz Japanese red-line selvedge denim woven on vintage Toyoda shuttle looms in Okayama. Pure indigo rope-dyed with custom embossed copper rivets.',
    category: 'Jeans',
    subcategory: 'Selvedge',
    gender: 'men',
    price: 5999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1000&q=80'
    ],
    colors: [
      { name: 'Deep Indigo', hex: '#1A2A44', inStock: true }
    ],
    sizes: [
      { size: '30', stock: 10 },
      { size: '32', stock: 18 },
      { size: '34', stock: 15 },
      { size: '36', stock: 8 }
    ],
    material: '100% Kurabo Japanese Ring-Spun Cotton',
    careInstructions: 'Wash inside-out in cold water after 6 months of raw wear.',
    specifications: [
      { key: 'Weight', value: '14.5 oz Heavyweight' },
      { key: 'Selvedge ID', value: 'Classic Red Line' }
    ],
    rating: 4.9,
    reviewCount: 31,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Okayama 15oz Vintage Washed Selvedge Jeans',
    slug: 'okayama-15oz-vintage-washed-selvedge-jeans',
    brand: 'VALENTI',
    description: 'Hand-distressed by master artisans in Kojima with authentic honeycomb whiskers, roped hems, and chain-stitched construction.',
    category: 'Jeans',
    subcategory: 'Slim Fit',
    gender: 'men',
    price: 6499,
    salePrice: 5299,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=80',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1000&q=80'
    ],
    colors: [
      { name: 'Vintage Sun-Bleach Indigo', hex: '#4682B4', inStock: true }
    ],
    sizes: [
      { size: '30', stock: 8 },
      { size: '32', stock: 15 },
      { size: '34', stock: 12 },
      { size: '36', stock: 6 }
    ],
    material: '100% Japanese Selvedge Cotton (15 oz)',
    careInstructions: 'Wash cold inside out. Hang dry.',
    specifications: [
      { key: 'Wash', value: '3-Year Natural Artisan Fade' },
      { key: 'Hardware', value: 'Solid Cast Iron Donut Buttons' }
    ],
    rating: 4.9,
    reviewCount: 27,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Black Coated Minimalist Skinny-Slim Denim',
    slug: 'black-coated-minimalist-skinny-slim-denim',
    brand: 'VALENTI',
    description: 'Wax-coated jet black denim with a subtle leather-like satin sheen. Tailored with clean minimal hardware for sleek evening styling.',
    category: 'Jeans',
    subcategory: 'Slim Fit',
    gender: 'men',
    price: 5499,
    salePrice: 4399,
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1000&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=80',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1000&q=80'
    ],
    colors: [
      { name: 'Waxed Noir', hex: '#0D0D0D', inStock: true }
    ],
    sizes: [
      { size: '30', stock: 9 },
      { size: '32', stock: 16 },
      { size: '34', stock: 14 },
      { size: '36', stock: 7 }
    ],
    material: '98% Cotton, 2% Polyurethane Resinated Coating',
    careInstructions: 'Cold hand wash only to preserve wax finish.',
    specifications: [
      { key: 'Finish', value: 'Semi-Matte Wax Coating' },
      { key: 'Fit', value: 'Sleek Tapered Leg' }
    ],
    rating: 4.8,
    reviewCount: 18,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false
  },

  // ==========================================
  // MEN: DENIM & CASUALS - CASHMERE KNITWEAR
  // ==========================================
  {
    name: 'Mongolian Pure Cashmere Crewneck Sweater',
    slug: 'mongolian-pure-cashmere-crewneck-sweater',
    brand: 'VALENTI',
    description: 'Spun from Grade-A 2-ply 100% Mongolian cashmere (15.2 micron fineness), providing sublime cloud-like lightness and supreme warmth.',
    category: 'Knitwear',
    subcategory: 'Cashmere Knitwear',
    gender: 'men',
    price: 9999,
    salePrice: 7999,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=80',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1000&q=80',
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e98?w=1000&q=80'
    ],
    colors: [
      { name: 'Oatmeal Cashmere', hex: '#E3DAC9', inStock: true },
      { name: 'Midnight Charcoal', hex: '#232B2B', inStock: true },
      { name: 'Forest Green', hex: '#1C3F3A', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 5 }
    ],
    material: '100% Grade-A Mongolian Cashmere (15.2 Micron, 2-Ply)',
    careInstructions: 'Hand wash with wool shampoo in cold water or dry clean.',
    specifications: [
      { key: 'Gauge', value: '12-Gauge Seamless Knit' },
      { key: 'Trim', value: '2x2 Ribbed Hem and Cuffs' }
    ],
    rating: 5.0,
    reviewCount: 36,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Ribbed Extra-Fine Merino Wool Turtleneck',
    slug: 'ribbed-extra-fine-merino-wool-turtleneck',
    brand: 'VALENTI',
    description: 'Essential layering for winter tailoring. Spun from 19.5-micron Italian merino wool with a refined roll-neck and snug thermal fit.',
    category: 'Knitwear',
    subcategory: 'Cashmere Knitwear',
    gender: 'men',
    price: 6499,
    salePrice: 5199,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1000&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=80',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Noir', hex: '#0B0B0C', inStock: true },
      { name: 'Burgundy Wine', hex: '#58111A', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 6 }
    ],
    material: '100% Biella Extra-Fine Merino Wool',
    careInstructions: 'Dry clean or gentle hand wash cold.',
    specifications: [
      { key: 'Neck', value: 'Double Fold Rollneck' },
      { key: 'Knit', value: 'Fine 14-Gauge Micro Rib' }
    ],
    rating: 4.9,
    reviewCount: 21,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Milanese Cable-Knit Cashmere-Silk Cardigan',
    slug: 'milanese-cable-knit-cashmere-silk-cardigan',
    brand: 'VALENTI',
    description: 'Heritage cable patterning handcrafted with genuine horn buttons, shawl collar, and patch pockets in a lush 70/30 cashmere-silk blend.',
    category: 'Knitwear',
    subcategory: 'Cashmere Knitwear',
    gender: 'men',
    price: 11499,
    salePrice: 9499,
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e98?w=1000&q=80',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1000&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=80'
    ],
    colors: [
      { name: 'Camel Ecru', hex: '#C2A68D', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 4 }
    ],
    material: '70% Grade-A Cashmere, 30% Mulberry Silk',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Collar', value: 'Ribbed Shawl Lapel' },
      { key: 'Buttons', value: 'Hand-Turned Water Buffalo Horn' }
    ],
    rating: 5.0,
    reviewCount: 17,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },


  // WOMEN PRODUCTS
  {
    name: 'Aurelia Mulberry Silk Maxi Gown',
    slug: 'aurelia-mulberry-silk-maxi-gown',
    brand: 'VALENTI',
    description: 'An ode to timeless glamour. Cut on the bias from 22-momme pure mulberry silk charmeuse, featuring an open cowl back and subtle train for gala evenings.',
    category: 'Dresses',
    subcategory: 'Evening Gowns',
    gender: 'women',
    price: 11999,
    salePrice: 9499,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37', inStock: true },
      { name: 'Emerald Jewel', hex: '#004B23', inStock: true },
      { name: 'Midnight Onyx', hex: '#0B0B0C', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 6 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 8 }
    ],
    material: '100% Grade 6A Mulberry Silk Charmeuse (22 Momme)',
    careInstructions: 'Professional dry clean only. Use silk hanger.',
    specifications: [
      { key: 'Silhouette', value: 'Bias-Cut Slip Floor-Length' },
      { key: 'Back', value: 'Low Cowl Open Back with Adjustable Strap' }
    ],
    rating: 5.0,
    reviewCount: 54,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Sculpted Hourglass Tuxedo Blazer Dress',
    slug: 'sculpted-hourglass-tuxedo-blazer-dress',
    brand: 'VALENTI',
    description: 'Sharp tailoring meets modern feminine silhouette. Featuring satin shawl lapels, cinched waistline, and handcrafted golden crest buttons.',
    category: 'Dresses',
    subcategory: 'Blazer Dresses',
    gender: 'women',
    price: 8999,
    salePrice: 7299,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=80'
    ],
    colors: [
      { name: 'Pure Ivory', hex: '#FDFBF7', inStock: true },
      { name: 'Jet Noir', hex: '#111111', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 6 }
    ],
    material: 'Tailored Crepe with Italian Silk Duchesse Satin Trim',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Lapel', value: 'Silk Satin Shawl Lapel' },
      { key: 'Closure', value: 'Double Breasted Button Fastening' }
    ],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Draped Silk Crepe-de-Chine Blouse',
    slug: 'draped-silk-crepe-de-chine-blouse',
    brand: 'VALENTI',
    description: 'Fluid drape with elongated French cuffs and a removable neck pussy-bow ribbon. Versatile for boardroom and candlelight dinners.',
    category: 'Tops & Shirts',
    subcategory: 'Silk Blouses',
    gender: 'women',
    price: 4499,
    salePrice: 3599,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1000&q=80',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1000&q=80'
    ],
    colors: [
      { name: 'Dusty Blush', hex: '#D8A49B', inStock: true },
      { name: 'Ivory White', hex: '#FFFFF5', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 18 },
      { size: 'M', stock: 16 },
      { size: 'L', stock: 8 }
    ],
    material: '100% Silk Crepe-de-Chine',
    careInstructions: 'Dry clean or cold hand wash with silk detergent.',
    specifications: [
      { key: 'Neckline', value: 'Tie-Neck Bow Accent' },
      { key: 'Cuffs', value: 'Extended 3-Button French Cuffs' }
    ],
    rating: 4.8,
    reviewCount: 22,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'High-Waisted Draped Palazzo Trousers',
    slug: 'high-waisted-draped-palazzo-trousers',
    brand: 'VALENTI',
    description: 'Dramatic wide-leg silhouette that elongates the frame. Crafted from heavy Japanese triacetate that falls with fluid elegance and resistance to wrinkling.',
    category: 'Trousers & Skirts',
    subcategory: 'Wide-Leg Trousers',
    gender: 'women',
    price: 4999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80'
    ],
    colors: [
      { name: 'Classic Black', hex: '#151515', inStock: true },
      { name: 'Warm Camel', hex: '#C19A6B', inStock: true }
    ],
    sizes: [
      { size: '26', stock: 6 },
      { size: '28', stock: 14 },
      { size: '30', stock: 12 },
      { size: '32', stock: 8 }
    ],
    material: '82% Japanese Triacetate, 18% Silk',
    careInstructions: 'Dry clean recommended.',
    specifications: [
      { key: 'Waist', value: 'High-Rise Contoured Waistband' },
      { key: 'Leg', value: 'Dramatic Wide Palazzo Hem' }
    ],
    rating: 4.9,
    reviewCount: 29,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Cashmere-Blend Belted Trench Coat',
    slug: 'cashmere-blend-belted-trench-coat',
    brand: 'VALENTI',
    description: 'The definitive transitional outer layer. Cut from water-repellent dense wool and cashmere gabardine with storm flaps, epaulettes, and horn belt buckle.',
    category: 'Blazers & Outerwear',
    subcategory: 'Trench Coats',
    gender: 'women',
    price: 18999,
    salePrice: 15999,
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80'
    ],
    colors: [
      { name: 'Royal Camel', hex: '#B8860B', inStock: true },
      { name: 'Midnight Blue', hex: '#191970', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 6 }
    ],
    material: '80% Italian Wool, 20% Cashmere Gabardine',
    careInstructions: 'Specialist dry clean only.',
    specifications: [
      { key: 'Length', value: '115cm Mid-Calf Length' },
      { key: 'Belt', value: 'Self-Fabric Belt with Solid Brass Buckle' }
    ],
    rating: 5.0,
    reviewCount: 47,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Liquid Satin Bias Midi Skirt',
    slug: 'liquid-satin-bias-midi-skirt',
    brand: 'VALENTI',
    description: 'An effortlessly chic staple that pairs seamlessly with chunky knitwear or a crisp tuxedo shirt. Featuring an elasticized interior waistband.',
    category: 'Trousers & Skirts',
    subcategory: 'Satin Skirts',
    gender: 'women',
    price: 3499,
    salePrice: 2799,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80'
    ],
    colors: [
      { name: 'Sage Mint', hex: '#9CAF88', inStock: true },
      { name: 'Espresso Bronze', hex: '#4A3B32', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 12 },
      { size: 'S', stock: 20 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 10 }
    ],
    material: '100% Heavy Silky Satin',
    careInstructions: 'Hand wash cold or gentle machine wash.',
    specifications: [
      { key: 'Cut', value: 'True Bias Cut' },
      { key: 'Length', value: 'Midi (82cm)' }
    ],
    rating: 4.7,
    reviewCount: 31,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  }
];

const couponsData = [
  {
    code: 'VALENTI10',
    description: '10% Welcome discount on your entire order',
    discountPercent: 10,
    minOrderValue: 0,
    maxDiscountAmount: 2000,
    isActive: true
  },
  {
    code: 'LUXE20',
    description: '20% Privilege discount for sartorial purchases above ₹4,999',
    discountPercent: 20,
    minOrderValue: 4999,
    maxDiscountAmount: 5000,
    isActive: true
  },
  {
    code: 'ATELIER15',
    description: '15% Seasonal Runway special discount',
    discountPercent: 15,
    minOrderValue: 2499,
    maxDiscountAmount: 3500,
    isActive: true
  }
];

export const seedDatabase = async (isStandalone = true) => {
  try {
    if (isStandalone) {
      await connectDB();
    }

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();

    console.log('👤 Creating default users (Admin & Customer)...');
    const admin = await User.create({
      name: 'Alexander Valenti (Admin)',
      email: 'admin@valenti.com',
      password: 'Admin@12345',
      role: 'admin',
      phone: '+91 98765 43210',
      addresses: [
        {
          fullName: 'Alexander Valenti',
          phone: '+91 98765 43210',
          addressLine1: 'Atelier Valenti, 42 Heritage Boulevard',
          addressLine2: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true
        }
      ]
    });

    const customer = await User.create({
      name: 'Eleanor Vance',
      email: 'customer@valenti.com',
      password: 'Customer@12345',
      role: 'customer',
      phone: '+91 91234 56789',
      addresses: [
        {
          fullName: 'Eleanor Vance',
          phone: '+91 91234 56789',
          addressLine1: 'Penthouse 14B, Skyview Towers',
          addressLine2: 'Koregaon Park Road',
          city: 'Pune',
          state: 'Maharashtra',
          postalCode: '411001',
          country: 'India',
          isDefault: true
        }
      ]
    });

    console.log('🏷️ Creating Categories...');
    await Category.insertMany(categoriesData);

    console.log('👗 Creating Products...');
    const insertedProducts = await Product.insertMany(productsData);

    console.log('🎟️ Creating Coupons...');
    await Coupon.insertMany(couponsData);

    console.log('⭐ Creating Reviews...');
    if (insertedProducts.length > 0) {
      await Review.create({
        product: insertedProducts[0]._id,
        user: customer._id,
        userName: customer.name,
        rating: 5,
        title: 'Exceptional craftsmanship and collar roll',
        comment: 'The drape and lustre of this shirt are on par with bespoke Savile Row shirts. Fits like a glove with no puckering at the seams.',
        verifiedPurchase: true
      });

      await Review.create({
        product: insertedProducts[6]._id,
        user: customer._id,
        userName: customer.name,
        rating: 5,
        title: 'Unbelievably soft silk - draped to perfection',
        comment: 'Wore this gown to a black-tie gala in Mumbai. Received endless compliments! The champagne gold hue is breathtaking in person.',
        verifiedPurchase: true
      });
    }

    console.log('📦 Creating Sample Customer Order...');
    if (insertedProducts.length >= 2) {
      const order = await Order.create({
        user: customer._id,
        orderNumber: 'VAL-2026-784912',
        trackingNumber: 'TRK-VAL26-89241',
        items: [
          {
            product: insertedProducts[0]._id,
            name: insertedProducts[0].name,
            image: insertedProducts[0].images[0],
            price: insertedProducts[0].salePrice || insertedProducts[0].price,
            size: '40',
            color: 'Crisp White',
            quantity: 1,
            subtotal: insertedProducts[0].salePrice || insertedProducts[0].price
          },
          {
            product: insertedProducts[3]._id,
            name: insertedProducts[3].name,
            image: insertedProducts[3].images[0],
            price: insertedProducts[3].salePrice || insertedProducts[3].price,
            size: 'M',
            color: 'Forest Emerald',
            quantity: 1,
            subtotal: insertedProducts[3].salePrice || insertedProducts[3].price
          }
        ],
        shippingAddress: customer.addresses[0],
        paymentMethod: 'Card',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        pricing: {
          subtotal: 4798,
          discount: 479,
          couponCode: 'VALENTI10',
          deliveryCharge: 0,
          tax: 215,
          total: 4534
        },
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        timeline: [
          {
            status: 'Confirmed',
            title: 'Order Confirmed',
            description: 'Your order was verified and confirmed.',
            timestamp: new Date(Date.now() - 48 * 3600000)
          },
          {
            status: 'Processing',
            title: 'Garments Hand-Inspected',
            description: 'Atelier artisans completed final steam press & packaging.',
            timestamp: new Date(Date.now() - 24 * 3600000)
          },
          {
            status: 'Shipped',
            title: 'Shipped with Express Courier',
            description: 'Package in transit via BlueDart Air Express.',
            timestamp: new Date(Date.now() - 6 * 3600000)
          }
        ]
      });
    }

    console.log('\n=================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=================================================');
    console.log('🔑 ADMIN DEMO LOGIN:');
    console.log('   Email: admin@valenti.com');
    console.log('   Password: Admin@12345');
    console.log('👤 CUSTOMER DEMO LOGIN:');
    console.log('   Email: customer@valenti.com');
    console.log('   Password: Customer@12345');
    console.log('=================================================\n');

    if (isStandalone) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    if (isStandalone) {
      process.exit(1);
    }
  }
};

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase(true);
}
