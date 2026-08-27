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
      { name: 'Straight Fit', slug: 'straight-fit', description: 'Classic heritage cut' }
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
  // MEN PRODUCTS
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
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=80'
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
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1000&q=80'
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
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80'
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
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=80'
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
    name: 'Selvedge Raw Kurabo Denim Jeans',
    slug: 'selvedge-raw-kurabo-denim-jeans',
    brand: 'VALENTI',
    description: '14oz Japanese red-line selvedge denim woven on vintage shuttle looms in Okayama. Pure indigo rope-dyed with custom embossed copper rivets.',
    category: 'Jeans',
    subcategory: 'Slim Fit',
    gender: 'men',
    price: 5999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&q=80'
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
    isFeatured: false,
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
