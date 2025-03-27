// Script to fix gift card data issues
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const DB_PATH = path.join(__dirname, 'giftcards_db.json');

console.log('Starting gift card data fix script...');

// Check if database file exists
if (!fs.existsSync(DB_PATH)) {
  console.error(`Database file not found at: ${DB_PATH}`);
  process.exit(1);
}

try {
  // Read the database
  const data = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(data);
  
  console.log(`Found ${db.giftCards?.length || 0} gift cards in database`);
  
  // Fix the data issues
  if (db.giftCards && Array.isArray(db.giftCards)) {
    db.giftCards = db.giftCards.map(card => {
      console.log(`Processing card: ${card.code}`);
      
      // Fix amount values - make sure they're numbers
      if (card.originalAmount !== undefined) {
        const originalAmount = parseFloat(card.originalAmount);
        card.originalAmount = isNaN(originalAmount) ? 0 : originalAmount;
      }
      
      if (card.currentAmount !== undefined) {
        const currentAmount = parseFloat(card.currentAmount);
        card.currentAmount = isNaN(currentAmount) ? 0 : currentAmount;
      }
      
      // Fix date formats
      if (card.purchaseDate) {
        try {
          // Try to parse the date and format it consistently
          const date = new Date(card.purchaseDate);
          if (!isNaN(date.getTime())) {
            // Format as MM/DD/YYYY for consistency
            card.purchaseDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          }
        } catch (error) {
          console.error(`Error fixing purchase date for card ${card.code}:`, error);
        }
      } else {
        // Set a default date if missing
        const today = new Date();
        card.purchaseDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      }
      
      if (card.expiryDate) {
        try {
          // Try to parse the date and format it consistently
          const date = new Date(card.expiryDate);
          if (!isNaN(date.getTime())) {
            // Format as MM/DD/YYYY for consistency
            card.expiryDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          }
        } catch (error) {
          console.error(`Error fixing expiry date for card ${card.code}:`, error);
        }
      } else {
        // Set a default expiry date if missing (1 year from purchase)
        const purchaseDate = new Date(card.purchaseDate);
        if (!isNaN(purchaseDate.getTime())) {
          const expiryDate = new Date(purchaseDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          card.expiryDate = `${expiryDate.getMonth() + 1}/${expiryDate.getDate()}/${expiryDate.getFullYear()}`;
        } else {
          const today = new Date();
          const nextYear = new Date(today);
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          card.expiryDate = `${nextYear.getMonth() + 1}/${nextYear.getDate()}/${nextYear.getFullYear()}`;
        }
      }
      
      return card;
    });
    
    // Save the fixed database
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    
    console.log('Database successfully updated!');
    console.log(`Fixed ${db.giftCards.length} gift cards`);
  } else {
    console.error('Invalid database structure: giftCards array not found');
  }
} catch (error) {
  console.error('Error processing gift card database:', error);
  process.exit(1);
} 