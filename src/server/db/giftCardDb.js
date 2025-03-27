import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database path from environment variable or use default
const dbPath = process.env.GIFTCARDS_DB_PATH || 
  path.join(path.resolve(__dirname, '../../../'), 'giftcards_db.json');

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
  console.log(`Creating gift cards database at ${dbPath}`);
  fs.writeFileSync(dbPath, JSON.stringify({ giftCards: [] }, null, 2));
}

// Read the gift cards database
export const readGiftCardsDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading gift cards database:', error);
    return { giftCards: [] };
  }
};

// Write to the gift cards database
export const writeGiftCardsDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to gift cards database:', error);
    return false;
  }
};

// Get all gift cards
export const getAllGiftCards = () => {
  const db = readGiftCardsDb();
  return db.giftCards || [];
};

// Get a gift card by ID
export const getGiftCardById = (id) => {
  const giftCards = getAllGiftCards();
  return giftCards.find(card => card.id === id);
};

// Add a new gift card
export const addGiftCard = (giftCardData) => {
  const db = readGiftCardsDb();
  db.giftCards = db.giftCards || [];
  db.giftCards.push(giftCardData);
  return writeGiftCardsDb(db);
};

// Update a gift card
export const updateGiftCard = (id, updatedData) => {
  const db = readGiftCardsDb();
  db.giftCards = db.giftCards || [];
  
  const index = db.giftCards.findIndex(card => card.id === id);
  if (index === -1) return false;
  
  db.giftCards[index] = { ...db.giftCards[index], ...updatedData };
  return writeGiftCardsDb(db);
};

// Delete a gift card
export const deleteGiftCard = (id) => {
  const db = readGiftCardsDb();
  db.giftCards = db.giftCards || [];
  
  const initialLength = db.giftCards.length;
  db.giftCards = db.giftCards.filter(card => card.id !== id);
  
  if (db.giftCards.length === initialLength) return false;
  return writeGiftCardsDb(db);
}; 