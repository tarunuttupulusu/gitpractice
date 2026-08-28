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

  // ==========================================
  // WOMEN CATEGORY 1: DRESSES (10 Products)
  // ==========================================
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
    name: 'Venetian Velvet Corset Ballgown',
    slug: 'venetian-velvet-corset-ballgown',
    brand: 'VALENTI',
    description: 'Sumptuous Italian silk-velvet with an interior boned corset bodice, off-the-shoulder draped neckline, and sweeping side slit.',
    category: 'Dresses',
    subcategory: 'Evening Gowns',
    gender: 'women',
    price: 14499,
    salePrice: 12999,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80'
    ],
    colors: [
      { name: 'Royal Burgundy', hex: '#800020', inStock: true },
      { name: 'Midnight Onyx', hex: '#0B0B0C', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 5 }
    ],
    material: '80% Silk, 20% Rayon Italian Velvet',
    careInstructions: 'Specialist dry clean only.',
    specifications: [
      { key: 'Bodice', value: 'Internal Boned Bustier' },
      { key: 'Detail', value: 'Thigh-High Asymmetrical Slit' }
    ],
    rating: 4.9,
    reviewCount: 41,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Emerald Silk Satin Cutout Midi Dress',
    slug: 'emerald-silk-satin-cutout-midi-dress',
    brand: 'VALENTI',
    description: 'An architectural silhouette featuring delicate waist keyhole cutouts, long fluid sleeves, and a column midi skirt with invisible back zip.',
    category: 'Dresses',
    subcategory: 'Midi Dresses',
    gender: 'women',
    price: 6799,
    salePrice: 5499,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80'
    ],
    colors: [
      { name: 'Emerald Jewel', hex: '#004B23', inStock: true },
      { name: 'Champagne Gold', hex: '#D4AF37', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 7 },
      { size: 'S', stock: 14 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 8 }
    ],
    material: '100% Mulberry Silk Charmeuse',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Cut', value: 'Waist Flank Cutouts' },
      { key: 'Length', value: '120cm Midi' }
    ],
    rating: 4.8,
    reviewCount: 29,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Grecian Pleated Chiffon Column Gown',
    slug: 'grecian-pleated-chiffon-column-gown',
    brand: 'VALENTI',
    description: 'Hand-pleated micro sunburst chiffon cascading from a gilded choker neckline into an ethereal floor-grazing drape.',
    category: 'Dresses',
    subcategory: 'Evening Gowns',
    gender: 'women',
    price: 12999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80'
    ],
    colors: [
      { name: 'Ivory Cream', hex: '#FFFFF0', inStock: true },
      { name: 'Dusty Blush', hex: '#D8A49B', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 9 },
      { size: 'M', stock: 11 },
      { size: 'L', stock: 6 }
    ],
    material: '100% Silk Chiffon with Habotai Lining',
    careInstructions: 'Specialist dry clean only.',
    specifications: [
      { key: 'Neckline', value: 'Gold-Tone Metal Choker Halter' },
      { key: 'Pleating', value: 'Permanent Sunburst Accordion Pleats' }
    ],
    rating: 5.0,
    reviewCount: 33,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Off-Shoulder Crepe Mermaid Evening Dress',
    slug: 'off-shoulder-crepe-mermaid-evening-dress',
    brand: 'VALENTI',
    description: 'Contoured heavy crepe dress sculpted to hug every curve before flaring into a soft mermaid hem with a concealed sweep train.',
    category: 'Dresses',
    subcategory: 'Evening Gowns',
    gender: 'women',
    price: 10499,
    salePrice: 8999,
    images: [
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Noir', hex: '#111111', inStock: true },
      { name: 'Scarlet Ruby', hex: '#9B111E', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 6 }
    ],
    material: 'Double-Weave Stretch Silk Crepe',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Neckline', value: 'Architectural Foldover Off-Shoulder' },
      { key: 'Hem', value: 'Mermaid Trumpet Flared Hem' }
    ],
    rating: 4.9,
    reviewCount: 46,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Liquid Gold Asymmetric Drape Slip Dress',
    slug: 'liquid-gold-asymmetric-drape-slip-dress',
    brand: 'VALENTI',
    description: 'Crafted from luminous metallic gold satin with a one-shoulder diagonal drape and delicate spaghetti strap support.',
    category: 'Dresses',
    subcategory: 'Midi Dresses',
    gender: 'women',
    price: 5999,
    salePrice: 4899,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1000&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 14 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 7 }
    ],
    material: '100% Metallic Lustre Satin',
    careInstructions: 'Dry clean recommended.',
    specifications: [
      { key: 'Shoulder', value: 'Asymmetric One-Shoulder Drape' },
      { key: 'Fit', value: 'Bias-Cut Liquid Silhouette' }
    ],
    rating: 4.8,
    reviewCount: 27,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'French Chantilly Lace Cocktail Dress',
    slug: 'french-chantilly-lace-cocktail-dress',
    brand: 'VALENTI',
    description: 'Intricate floral French lace over a nude silk bodice with scallop edge hem and sheer long sleeves for evening soirées.',
    category: 'Dresses',
    subcategory: 'Midi Dresses',
    gender: 'women',
    price: 8499,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Noir', hex: '#111111', inStock: true },
      { name: 'Pure Ivory', hex: '#FDFBF7', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 6 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 5 }
    ],
    material: 'Authentic French Chantilly Lace with 100% Silk Lining',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Sleeve', value: 'Sheer Scalloped Long Sleeve' },
      { key: 'Length', value: '110cm Knee-Length Cocktail' }
    ],
    rating: 4.9,
    reviewCount: 22,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Structured Brocade Jacquard Mini Dress',
    slug: 'structured-brocade-jacquard-mini-dress',
    brand: 'VALENTI',
    description: 'Woven with gold and silver metallic threads in a baroque floral motif. Features sharp shoulders and double flap pockets.',
    category: 'Dresses',
    subcategory: 'Blazer Dresses',
    gender: 'women',
    price: 7299,
    salePrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=1000&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=80'
    ],
    colors: [
      { name: 'Baroque Gold', hex: '#C5A059', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 9 },
      { size: 'L', stock: 4 }
    ],
    material: 'Italian Metallic Jacquard Brocade',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Structure', value: 'Reinforced Tailored Shoulders' },
      { key: 'Buttons', value: 'Engraved Lion Crest Metal Buttons' }
    ],
    rating: 4.7,
    reviewCount: 19,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Tiered Ruffle Tulle Gala Gown',
    slug: 'tiered-ruffle-tulle-gala-gown',
    brand: 'VALENTI',
    description: 'A showstopping red carpet gown featuring over 60 meters of hand-pleated fine illusion tulle cascading in voluminous tiers.',
    category: 'Dresses',
    subcategory: 'Evening Gowns',
    gender: 'women',
    price: 16999,
    salePrice: 13999,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80'
    ],
    colors: [
      { name: 'Dusty Blush', hex: '#D8A49B', inStock: true },
      { name: 'Midnight Onyx', hex: '#0B0B0C', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 4 }
    ],
    material: '100% Fine Parisian Illusion Tulle',
    careInstructions: 'Specialist haute couture dry clean only.',
    specifications: [
      { key: 'Volume', value: '5-Tier Flounced Sweep Skirt' },
      { key: 'Corset', value: 'Bandeau Corset with Gripper Tape' }
    ],
    rating: 5.0,
    reviewCount: 48,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },

  // ==========================================
  // WOMEN CATEGORY 2: TOPS & SHIRTS (10 Products)
  // ==========================================
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
    name: 'Victorian High-Collar Ruffle Silk Shirt',
    slug: 'victorian-high-collar-ruffle-silk-shirt',
    brand: 'VALENTI',
    description: 'Dramatic standing ruffle collar and bib front in translucent silk georgette with genuine mother-of-pearl micro buttons.',
    category: 'Tops & Shirts',
    subcategory: 'Formal Shirts',
    gender: 'women',
    price: 4999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=1000&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1000&q=80'
    ],
    colors: [
      { name: 'Pure Ivory', hex: '#FDFBF7', inStock: true },
      { name: 'Jet Noir', hex: '#111111', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 14 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 6 }
    ],
    material: '100% Silk Georgette',
    careInstructions: 'Hand wash cold or gentle dry clean.',
    specifications: [
      { key: 'Collar', value: 'Pleated Victorian Standing Ruffle' },
      { key: 'Buttons', value: 'Hand-Sewn Natural Shell Buttons' }
    ],
    rating: 4.9,
    reviewCount: 31,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Structured Satin Corset Bustier Top',
    slug: 'structured-satin-corset-bustier-top',
    brand: 'VALENTI',
    description: 'Precision-tailored underwire corset top featuring internal flexi-boning, sweetheart plunge neckline, and hook-and-eye closure.',
    category: 'Tops & Shirts',
    subcategory: 'Silk Blouses',
    gender: 'women',
    price: 3899,
    salePrice: 3199,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&q=80'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37', inStock: true },
      { name: 'Classic Black', hex: '#151515', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 16 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 8 }
    ],
    material: 'Heavyweight Duchesse Satin with Cotton Twill Lining',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Boning', value: '12 Flexible Structural Stays' },
      { key: 'Back', value: 'Adjustable Eyelet Lace-Up Back' }
    ],
    rating: 4.9,
    reviewCount: 44,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Organza Balloon-Sleeve Peplum Blouse',
    slug: 'organza-balloon-sleeve-peplum-blouse',
    brand: 'VALENTI',
    description: 'Voluminous sheer organza sleeves contrast with a fitted tailored torso and flared peplum waist.',
    category: 'Tops & Shirts',
    subcategory: 'Silk Blouses',
    gender: 'women',
    price: 4299,
    salePrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1000&q=80'
    ],
    colors: [
      { name: 'Dusty Blush', hex: '#D8A49B', inStock: true },
      { name: 'Ivory White', hex: '#FFFFF5', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 7 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 6 }
    ],
    material: 'Silk Organza with Crepe Lining',
    careInstructions: 'Dry clean recommended.',
    specifications: [
      { key: 'Sleeve', value: 'Oversized Tiered Balloon Sleeve' },
      { key: 'Waist', value: 'Flared Architectural Peplum' }
    ],
    rating: 4.7,
    reviewCount: 18,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Crisp Italian Poplin Tailored Button-Down',
    slug: 'crisp-italian-poplin-tailored-button-down',
    brand: 'VALENTI',
    description: 'Woven from 120s two-ply Italian stretch cotton poplin. Cut with curved princess seams for a flattering, sharp fit under blazers.',
    category: 'Tops & Shirts',
    subcategory: 'Formal Shirts',
    gender: 'women',
    price: 3499,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=80'
    ],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF', inStock: true },
      { name: 'Sky Azure', hex: '#A4C8E1', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 12 },
      { size: 'S', stock: 20 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 10 }
    ],
    material: '97% Italian Giza Cotton, 3% Elastane',
    careInstructions: 'Machine wash warm. Warm steam iron.',
    specifications: [
      { key: 'Collar', value: 'Pointed Spread Collar' },
      { key: 'Placket', value: 'Concealed Covered Button Front' }
    ],
    rating: 4.8,
    reviewCount: 39,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Hand-Embroidered Silk Chiffon Camisole',
    slug: 'hand-embroidered-silk-chiffon-camisole',
    brand: 'VALENTI',
    description: 'Airy silk camisole with delicate floral bullion embroidery across the neckline and adjustable French ribbon straps.',
    category: 'Tops & Shirts',
    subcategory: 'Silk Blouses',
    gender: 'women',
    price: 2999,
    salePrice: 2399,
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1000&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1000&q=80'
    ],
    colors: [
      { name: 'Sage Mint', hex: '#9CAF88', inStock: true },
      { name: 'Ivory White', hex: '#FFFFF5', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 8 }
    ],
    material: '100% Silk Chiffon Double Layer',
    careInstructions: 'Hand wash cold with gentle detergent.',
    specifications: [
      { key: 'Embroidery', value: 'Hand-Stitched Micro Floral Threadwork' },
      { key: 'Straps', value: 'Adjustable Velvet Cord Straps' }
    ],
    rating: 4.6,
    reviewCount: 15,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    name: 'Cowl-Neck Liquid Satin Sleeveless Top',
    slug: 'cowl-neck-liquid-satin-sleeveless-top',
    brand: 'VALENTI',
    description: 'Effortless luxury in liquid satin. Drapes naturally into a flattering cowl neck that catches ambient light with soft luster.',
    category: 'Tops & Shirts',
    subcategory: 'Silk Blouses',
    gender: 'women',
    price: 3299,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80'
    ],
    colors: [
      { name: 'Espresso Bronze', hex: '#4A3B32', inStock: true },
      { name: 'Emerald Jewel', hex: '#004B23', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 16 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 8 }
    ],
    material: '100% Heavy Silky Satin',
    careInstructions: 'Dry clean or delicate cold wash.',
    specifications: [
      { key: 'Neckline', value: 'Deep Fluid Cowl Neck' },
      { key: 'Cut', value: 'Straight Relaxed Hem' }
    ],
    rating: 4.8,
    reviewCount: 26,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Asymmetrical Draped Jersey Wrap Top',
    slug: 'asymmetrical-draped-jersey-wrap-top',
    brand: 'VALENTI',
    description: 'Sculptural modal-silk jersey that twists around the waist for a bespoke wrap effect with gathered side ruching.',
    category: 'Tops & Shirts',
    subcategory: 'Silk Blouses',
    gender: 'women',
    price: 2899,
    salePrice: 2299,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80'
    ],
    colors: [
      { name: 'Classic Black', hex: '#151515', inStock: true },
      { name: 'Warm Camel', hex: '#C19A6B', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 12 },
      { size: 'S', stock: 18 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 }
    ],
    material: '85% Micro Modal, 15% Silk Jersey',
    careInstructions: 'Machine wash delicate cold.',
    specifications: [
      { key: 'Wrap', value: 'Integrated Cross-Body Wrap Tie' },
      { key: 'Ruching', value: 'Side Seam Gathers' }
    ],
    rating: 4.7,
    reviewCount: 20,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    name: 'Sheer Floral Lace Inset Tuxedo Shirt',
    slug: 'sheer-floral-lace-inset-tuxedo-shirt',
    brand: 'VALENTI',
    description: 'An alluring play on traditional tailoring with sheer guipure lace panels along the shoulders and spine.',
    category: 'Tops & Shirts',
    subcategory: 'Formal Shirts',
    gender: 'women',
    price: 4799,
    salePrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Noir', hex: '#111111', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 6 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 5 }
    ],
    material: 'Italian Cotton Sateen & French Lace Insets',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Panels', value: 'Laser-Cut Guipure Lace Yoke' },
      { key: 'Cuffs', value: 'Pleated French Cuffs with Gold Studs' }
    ],
    rating: 4.9,
    reviewCount: 34,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Cashmere-Silk Ribbed Knit Polo Top',
    slug: 'cashmere-silk-ribbed-knit-polo-top',
    brand: 'VALENTI',
    description: 'Spun from ultra-fine 18-gauge cashmere and silk yarn with a sleek Johnny polo collar and slim elongated sleeves.',
    category: 'Tops & Shirts',
    subcategory: 'Formal Shirts',
    gender: 'women',
    price: 5499,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=1000&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=80'
    ],
    colors: [
      { name: 'Ivory Cream', hex: '#FFFFF0', inStock: true },
      { name: 'Espresso Bronze', hex: '#4A3B32', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 9 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 8 }
    ],
    material: '70% Grade-A Mongolian Cashmere, 30% Mulberry Silk',
    careInstructions: 'Hand wash cold with wool wash. Lay flat to dry.',
    specifications: [
      { key: 'Gauge', value: '18-Gauge Ultra-Fine Ribbed Knit' },
      { key: 'Collar', value: 'Seamless Engineered Open Polo' }
    ],
    rating: 5.0,
    reviewCount: 41,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },

  // ==========================================
  // WOMEN CATEGORY 3: BLAZERS & OUTERWEAR (10 Products)
  // ==========================================
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
    name: 'Double-Breasted Wool Tuxedo Blazer',
    slug: 'double-breasted-wool-tuxedo-blazer',
    brand: 'VALENTI',
    description: 'Engineered with prominent peaked lapels, structured roped shoulders, and pure silk faille buttons. Power dressing at its finest.',
    category: 'Blazers & Outerwear',
    subcategory: 'Tailored Blazers',
    gender: 'women',
    price: 9999,
    salePrice: 7999,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Noir', hex: '#111111', inStock: true },
      { name: 'Pure Ivory', hex: '#FDFBF7', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 7 },
      { size: 'S', stock: 14 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 6 }
    ],
    material: 'Super 120s Italian Virgin Wool & Silk Lapels',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Closure', value: '6-Button Double Breasted' },
      { key: 'Lining', value: 'Full Bemberg Cupro Monogram Lining' }
    ],
    rating: 4.9,
    reviewCount: 36,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Italian Bouclé Tweed Cropped Jacket',
    slug: 'italian-boucle-tweed-cropped-jacket',
    brand: 'VALENTI',
    description: 'Heritage French-style bouclé tweed woven with metallic thread, trimmed with braided grosgrain and embossed lion crest buttons.',
    category: 'Blazers & Outerwear',
    subcategory: 'Tailored Blazers',
    gender: 'women',
    price: 8499,
    salePrice: 6999,
    images: [
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80'
    ],
    colors: [
      { name: 'Ivory Cream', hex: '#FFFFF0', inStock: true },
      { name: 'Dusty Blush', hex: '#D8A49B', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 6 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 5 }
    ],
    material: '70% Wool, 20% Cotton, 10% Metallic Bouclé Yarn',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Cut', value: 'Cropped Boxy Silhouette' },
      { key: 'Trim', value: 'Hand-Braided Cord Border' }
    ],
    rating: 4.8,
    reviewCount: 25,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Sculpted Hourglass Crepe Tailored Blazer',
    slug: 'sculpted-hourglass-crepe-tailored-blazer',
    brand: 'VALENTI',
    description: 'Flawlessly shaped to cinch the waist while maintaining structured shoulder line. Closes with a solitary statement horn button.',
    category: 'Blazers & Outerwear',
    subcategory: 'Tailored Blazers',
    gender: 'women',
    price: 8999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80'
    ],
    colors: [
      { name: 'Classic Black', hex: '#151515', inStock: true },
      { name: 'Warm Camel', hex: '#C19A6B', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 7 }
    ],
    material: '100% Japanese Triacetate Crepe',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Silhouette', value: 'Dramatic Hourglass Darting' },
      { key: 'Lapel', value: 'Narrow Notched Lapel' }
    ],
    rating: 4.9,
    reviewCount: 29,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Waterproof Silk-Lined Classic Trench Coat',
    slug: 'waterproof-silk-lined-classic-trench-coat',
    brand: 'VALENTI',
    description: 'Double-breasted timeless storm-proof trench made from high-density Egyptian cotton gabardine with silk-printed interior lining.',
    category: 'Blazers & Outerwear',
    subcategory: 'Trench Coats',
    gender: 'women',
    price: 16499,
    salePrice: 13999,
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80'
    ],
    colors: [
      { name: 'Raw Sand', hex: '#D2B48C', inStock: true },
      { name: 'Midnight Onyx', hex: '#0B0B0C', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 8 }
    ],
    material: '100% High-Density Cotton Gabardine (Water Repellent)',
    careInstructions: 'Professional dry clean.',
    specifications: [
      { key: 'Lining', value: 'Printed 100% Silk Twill Lining' },
      { key: 'Hardware', value: 'Hand-Milled Tortoiseshell Buckles' }
    ],
    rating: 5.0,
    reviewCount: 33,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Midnight Velvet Peaked Lapel Evening Jacket',
    slug: 'midnight-velvet-peaked-lapel-evening-jacket',
    brand: 'VALENTI',
    description: 'Lustrous silk velvet tailored into an evening smoking jacket with contrasting black satin shawl lapels and jetted pockets.',
    category: 'Blazers & Outerwear',
    subcategory: 'Tailored Blazers',
    gender: 'women',
    price: 11299,
    salePrice: 9499,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80'
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#1B263B', inStock: true },
      { name: 'Royal Burgundy', hex: '#800020', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 4 }
    ],
    material: '100% Italian Silk Velvet with Silk Satin Facing',
    careInstructions: 'Specialist dry clean only.',
    specifications: [
      { key: 'Lapel', value: 'Duchesse Satin Shawl Lapel' },
      { key: 'Fit', value: 'Slim Smoking Jacket Cut' }
    ],
    rating: 4.9,
    reviewCount: 28,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Reversible Double-Faced Cashmere Cape Coat',
    slug: 'reversible-double-faced-cashmere-cape-coat',
    brand: 'VALENTI',
    description: 'Hand-stitched double-faced pure cashmere cape that drapes effortlessly over evening wear with leather toggle closures.',
    category: 'Blazers & Outerwear',
    subcategory: 'Trench Coats',
    gender: 'women',
    price: 22999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1000&q=80',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1000&q=80'
    ],
    colors: [
      { name: 'Royal Camel', hex: '#B8860B', inStock: true },
      { name: 'Espresso Bronze', hex: '#4A3B32', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 4 }
    ],
    material: '100% Hand-Split Double-Face Cashmere',
    careInstructions: 'Specialist luxury dry clean.',
    specifications: [
      { key: 'Craft', value: 'Hand-Rolled Seamless Edges' },
      { key: 'Closure', value: 'Italian Calfskin Leather Toggles' }
    ],
    rating: 5.0,
    reviewCount: 17,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Leather-Trimmed Longline Wool Overcoat',
    slug: 'leather-trimmed-longline-wool-overcoat',
    brand: 'VALENTI',
    description: 'Heavyweight Melton wool tailored coat featuring nappa leather piping along collar, lapels, and cuffs for modern edge.',
    category: 'Blazers & Outerwear',
    subcategory: 'Trench Coats',
    gender: 'women',
    price: 19999,
    salePrice: 16999,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Noir', hex: '#111111', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 5 }
    ],
    material: '100% Italian Melton Wool with Lambskin Leather Piping',
    careInstructions: 'Specialist leather & wool dry clean.',
    specifications: [
      { key: 'Length', value: '125cm Ankle-Grazing Full Length' },
      { key: 'Pocket', value: 'Flapped Hip Welt Pockets' }
    ],
    rating: 4.9,
    reviewCount: 32,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Oversized Sartorial Pinstripe Wool Blazer',
    slug: 'oversized-sartorial-pinstripe-wool-blazer',
    brand: 'VALENTI',
    description: 'Masculine-inspired relaxed tailoring in chalk-stripe virgin wool with dropped shoulders and deep flap pockets.',
    category: 'Blazers & Outerwear',
    subcategory: 'Tailored Blazers',
    gender: 'women',
    price: 9499,
    salePrice: 7599,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80'
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#1B263B', inStock: true },
      { name: 'Classic Black', hex: '#151515', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 7 }
    ],
    material: '100% Wool Flannel with Fine Chalk Stripes',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Fit', value: 'Relaxed Oversized Silhouette' },
      { key: 'Buttons', value: 'Horn 2-Button Single Breasted' }
    ],
    rating: 4.8,
    reviewCount: 27,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Draped Shawl-Collar Belted Wool Wrap Coat',
    slug: 'draped-shawl-collar-belted-wool-wrap-coat',
    brand: 'VALENTI',
    description: 'Generous draped collar that frames the face, finished with an oversized tie belt and hidden interior anchor buttons.',
    category: 'Blazers & Outerwear',
    subcategory: 'Trench Coats',
    gender: 'women',
    price: 17499,
    salePrice: 14299,
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80'
    ],
    colors: [
      { name: 'Warm Camel', hex: '#C19A6B', inStock: true },
      { name: 'Ivory Cream', hex: '#FFFFF0', inStock: true }
    ],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 6 }
    ],
    material: '90% Virgin Wool, 10% Cashmere',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Collar', value: 'Sculpted Cascading Shawl Collar' },
      { key: 'Belt', value: 'Wide Tie Sash Belt' }
    ],
    rating: 5.0,
    reviewCount: 40,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },

  // ==========================================
  // WOMEN CATEGORY 4: TROUSERS & SKIRTS (10 Products)
  // ==========================================
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
  },
  {
    name: 'Pleated Accordion Chiffon Maxi Skirt',
    slug: 'pleated-accordion-chiffon-maxi-skirt',
    brand: 'VALENTI',
    description: 'Hundreds of micro knife pleats that open with mesmerizing fluid movement as you walk. Fitted with a grosgrain ribbon waistband.',
    category: 'Trousers & Skirts',
    subcategory: 'Satin Skirts',
    gender: 'women',
    price: 4299,
    salePrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1000&q=80'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37', inStock: true },
      { name: 'Classic Black', hex: '#151515', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 16 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 7 }
    ],
    material: 'Permanent Heat-Set Silk Chiffon with Satin Slip',
    careInstructions: 'Dry clean recommended.',
    specifications: [
      { key: 'Pleats', value: 'Uniform 0.5cm Accordion Pleating' },
      { key: 'Length', value: '98cm Floor-Skimming Maxi' }
    ],
    rating: 4.9,
    reviewCount: 35,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Tailored High-Rise Cigarette Trousers',
    slug: 'tailored-high-rise-cigarette-trousers',
    brand: 'VALENTI',
    description: 'Ankle-length slim tailored trousers with razor-sharp front crease, slant pockets, and subtle ankle vent.',
    category: 'Trousers & Skirts',
    subcategory: 'Wide-Leg Trousers',
    gender: 'women',
    price: 3999,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80'
    ],
    colors: [
      { name: 'Jet Noir', hex: '#111111', inStock: true },
      { name: 'Pure Ivory', hex: '#FDFBF7', inStock: true }
    ],
    sizes: [
      { size: '26', stock: 8 },
      { size: '28', stock: 16 },
      { size: '30', stock: 14 },
      { size: '32', stock: 8 }
    ],
    material: 'Italian Stretch Wool Crepe',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Cut', value: 'Slim Tapered Ankle Grazing' },
      { key: 'Crease', value: 'Permanent Front Press Crease' }
    ],
    rating: 4.8,
    reviewCount: 26,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'Structured Wool-Silk Pleated Culottes',
    slug: 'structured-wool-silk-pleated-culottes',
    brand: 'VALENTI',
    description: 'Wide cropped culotte silhouette with inverted front box pleats and a high tailored waistband.',
    category: 'Trousers & Skirts',
    subcategory: 'Wide-Leg Trousers',
    gender: 'women',
    price: 4799,
    salePrice: 3899,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1000&q=80'
    ],
    colors: [
      { name: 'Warm Camel', hex: '#C19A6B', inStock: true },
      { name: 'Midnight Navy', hex: '#1B263B', inStock: true }
    ],
    sizes: [
      { size: '26', stock: 6 },
      { size: '28', stock: 12 },
      { size: '30', stock: 10 },
      { size: '32', stock: 6 }
    ],
    material: '70% Wool, 30% Silk Twill',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Inseam', value: '65cm Cropped Wide Culotte' },
      { key: 'Pleating', value: 'Double Inverted Deep Box Pleats' }
    ],
    rating: 4.7,
    reviewCount: 18,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Silk Duchesse Mermaid Maxi Skirt',
    slug: 'silk-duchesse-mermaid-maxi-skirt',
    brand: 'VALENTI',
    description: 'Glamorous evening maxi skirt crafted from heavy structured silk duchesse, fitted through the hips before blooming into a graceful trumpet hem.',
    category: 'Trousers & Skirts',
    subcategory: 'Satin Skirts',
    gender: 'women',
    price: 6499,
    salePrice: 5199,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1000&q=80'
    ],
    colors: [
      { name: 'Midnight Onyx', hex: '#0B0B0C', inStock: true },
      { name: 'Emerald Jewel', hex: '#004B23', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 5 }
    ],
    material: '100% Silk Duchesse Satin (32 Momme)',
    careInstructions: 'Specialist dry clean only.',
    specifications: [
      { key: 'Shape', value: 'Mermaid Column with Flared Godet Panels' },
      { key: 'Closure', value: 'Invisible Center-Back Zip' }
    ],
    rating: 5.0,
    reviewCount: 39,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    name: 'Belted Wide-Leg Normandy Linen Trousers',
    slug: 'belted-wide-leg-normandy-linen-trousers',
    brand: 'VALENTI',
    description: 'Relaxed yet refined high-waisted linen trousers featuring a self-fabric buckle belt and generous deep front pockets.',
    category: 'Trousers & Skirts',
    subcategory: 'Wide-Leg Trousers',
    gender: 'women',
    price: 4499,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80'
    ],
    colors: [
      { name: 'Raw Sand', hex: '#D2B48C', inStock: true },
      { name: 'Crisp White', hex: '#FFFFFF', inStock: true }
    ],
    sizes: [
      { size: '26', stock: 8 },
      { size: '28', stock: 15 },
      { size: '30', stock: 14 },
      { size: '32', stock: 8 }
    ],
    material: '100% Certified Normandy Flax Linen',
    careInstructions: 'Machine wash cold gentle. Line dry.',
    specifications: [
      { key: 'Belt', value: 'Removable D-Ring Self Fabric Belt' },
      { key: 'Fit', value: 'Breezy Wide-Leg Summer Drape' }
    ],
    rating: 4.8,
    reviewCount: 23,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    name: 'Tiered Silk Crepe Flounce Midi Skirt',
    slug: 'tiered-silk-crepe-flounce-midi-skirt',
    brand: 'VALENTI',
    description: 'Cascading asymmetrical flounced tiers crafted from lightweight silk crepe that catches the breeze with every step.',
    category: 'Trousers & Skirts',
    subcategory: 'Satin Skirts',
    gender: 'women',
    price: 4999,
    salePrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1000&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&q=80'
    ],
    colors: [
      { name: 'Dusty Blush', hex: '#D8A49B', inStock: true },
      { name: 'Sage Mint', hex: '#9CAF88', inStock: true }
    ],
    sizes: [
      { size: 'XS', stock: 7 },
      { size: 'S', stock: 14 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 6 }
    ],
    material: '100% Silk Crepe-de-Chine',
    careInstructions: 'Dry clean or gentle hand wash.',
    specifications: [
      { key: 'Tiering', value: '3 Asymmetric Cascading Ruffle Tiers' },
      { key: 'Length', value: '85cm Midi' }
    ],
    rating: 4.7,
    reviewCount: 21,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    name: 'Double-Pleated Fluid Satin Evening Pants',
    slug: 'double-pleated-fluid-satin-evening-pants',
    brand: 'VALENTI',
    description: 'High-waisted trousers with tailored front double pleats, silk side tuxedo stripes, and fluid wide-leg puddle hem.',
    category: 'Trousers & Skirts',
    subcategory: 'Wide-Leg Trousers',
    gender: 'women',
    price: 5299,
    salePrice: 4299,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37', inStock: true },
      { name: 'Classic Black', hex: '#151515', inStock: true }
    ],
    sizes: [
      { size: '26', stock: 8 },
      { size: '28', stock: 14 },
      { size: '30', stock: 12 },
      { size: '32', stock: 6 }
    ],
    material: 'Heavyweight Triacetate Satin with Grosgrain Trim',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Stripe', value: 'Silk Satin Tuxedo Side Ribbon' },
      { key: 'Pleats', value: 'Double Inward Deep Pleats' }
    ],
    rating: 4.9,
    reviewCount: 30,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    name: 'High-Waisted Flared Silk-Crepe Trousers',
    slug: 'high-waisted-flared-silk-crepe-trousers',
    brand: 'VALENTI',
    description: 'Flattering 70s-inspired flared silhouette that fits snugly through the thigh before breaking into a generous bootcut flare.',
    category: 'Trousers & Skirts',
    subcategory: 'Wide-Leg Trousers',
    gender: 'women',
    price: 4899,
    salePrice: null,
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80'
    ],
    colors: [
      { name: 'Pure Ivory', hex: '#FDFBF7', inStock: true },
      { name: 'Jet Noir', hex: '#111111', inStock: true }
    ],
    sizes: [
      { size: '26', stock: 6 },
      { size: '28', stock: 12 },
      { size: '30', stock: 10 },
      { size: '32', stock: 5 }
    ],
    material: 'Double-Face Silk Crepe with Natural Stretch',
    careInstructions: 'Dry clean only.',
    specifications: [
      { key: 'Flare', value: '55cm Bell Flared Hem' },
      { key: 'Waist', value: 'Contoured High-Rise Without Belt Loops' }
    ],
    rating: 4.8,
    reviewCount: 24,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
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
