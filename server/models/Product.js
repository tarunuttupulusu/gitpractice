import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '#000000' },
  inStock: { type: Boolean, default: true }
}, { _id: false });

const sizeStockSchema = new mongoose.Schema({
  size: { type: String, required: true }, // 'XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', etc.
  stock: { type: Number, default: 10, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  brand: {
    type: String,
    default: 'VALENTI'
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  category: {
    type: String,
    required: [true, 'Please specify category (e.g. Shirts, T-Shirts, Dresses, Jeans, etc.)']
  },
  subcategory: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    required: [true, 'Please specify gender category']
  },
  price: {
    type: Number,
    required: [true, 'Please provide base price'],
    min: 0
  },
  salePrice: {
    type: Number,
    default: null
  },
  images: [{
    type: String,
    required: true
  }],
  colors: [colorSchema],
  sizes: [sizeStockSchema],
  stock: {
    type: Number,
    default: 25,
    min: 0
  },
  material: {
    type: String,
    default: '100% Premium Egyptian Cotton / Fine Italian Wool'
  },
  careInstructions: {
    type: String,
    default: 'Dry clean recommended. Machine wash cold on gentle cycle. Do not tumble dry.'
  },
  specifications: [{
    key: { type: String },
    value: { type: String }
  }],
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto compute total stock and isOnSale before save
productSchema.pre('save', function (next) {
  if (this.sizes && this.sizes.length > 0) {
    this.stock = this.sizes.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  }
  if (this.salePrice && this.salePrice < this.price) {
    this.isOnSale = true;
  } else {
    this.isOnSale = false;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
