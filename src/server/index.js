import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes
import giftCardRoutes from './routes/giftCards.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';
import setupRoutes from './routes/setup.js';

// Import database functions
import { updateExpiredGiftCards } from './db/giftCards.js';

// Initialize express
const app = express();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Special handling for Stripe webhooks (needs raw body)
app.use('/api/payments/webhook', 
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    if (req.originalUrl === '/api/payments/webhook') {
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  }
);

// Routes
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/setup', setupRoutes);

// In production, serve the static files from the build directory
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(rootDir, 'dist');
  app.use(express.static(buildPath));
  
  // Serve the index.html for any route not matched by API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Schedule automatic update of expired gift cards
// Run once at startup
updateExpiredGiftCards();

// Run every day at midnight
setInterval(() => {
  console.log('Running scheduled update of expired gift cards');
  updateExpiredGiftCards();
}, 24 * 60 * 60 * 1000);

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Export the app
export default app; 