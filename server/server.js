import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Product from './models/Product.js';
import { seedDatabase } from './seed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

// Initialize database and auto-seed if empty
const initApp = async () => {
  await connectDB();
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Empty catalog detected. Running automatic initial database seed...');
      await seedDatabase(false);
    }
  } catch (err) {
    console.error('Auto-seed check error:', err.message);
  }
};

initApp();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    brand: 'VALENTI ATELIER',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`⚜️  VALENTI ATELIER E-COMMERCE SERVER RUNNING`);
  console.log(`🚀  Port: ${PORT}`);
  console.log(`🌐  API URL: http://localhost:${PORT}/api`);
  console.log(`=================================================\n`);
});
