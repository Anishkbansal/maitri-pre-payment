import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes
import giftCardRoutes from './routes/giftCards.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';

// Import database functions
import { updateExpiredGiftCards } from './db/giftCards.js';

// Initialize express
const app = express();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', authRoutes);

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

// Export the app
export default app; 