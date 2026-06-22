import express from 'express';
import cors from 'cors';
import path from 'path';
import { upload } from './middlewares/uploadMiddleware.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Image Upload Endpoint (Multer local disk storage fallback)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Format the url path to ensure compatibility across OS
  const formattedPath = req.file.path.replace(/\\/g, '/');
  
  res.json({
    url: `http://localhost:${process.env.PORT || 5000}/${formattedPath}`,
    message: 'Image uploaded successfully'
  });
});

// Serve uploads as static assets
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root status check
app.get('/', (req, res) => {
  res.send('Anusree Tex E-Commerce API is running...');
});

// Fallback handlers
app.use(notFound);
app.use(errorHandler);

export default app;
