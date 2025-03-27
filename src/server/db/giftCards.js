import fs from 'fs';
import { DB_PATH } from '../config/index.js';

// Gift Card Status Enum
export const GiftCardStatus = {
  ACTIVE: 'active',        // Gift card is active and can be used
  EXPIRED: 'expired',      // Gift card is expired (past expiration date)
  EXHAUSTED: 'exhausted',  // Gift card has been used completely (balance = 0)
  CLOSED: 'closed'         // Gift card has been manually closed by admin
};

// Initialize gift card database
export function initializeGiftCardDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initialDB = {
      giftCards: [],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }

  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading gift card database:', error);
    const initialDB = {
      giftCards: [],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
}

// Save database
export function saveGiftCardDB(db) {
  db.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Add a new gift card to the database
export function addGiftCard(giftCardData) {
  const db = initializeGiftCardDB();
  
  const newGiftCard = {
    id: Date.now().toString(), // Unique ID based on timestamp
    code: giftCardData.giftCode,
    originalAmount: parseFloat(giftCardData.amount),
    currentAmount: parseFloat(giftCardData.amount),
    buyerName: giftCardData.buyerName,
    buyerEmail: giftCardData.buyerEmail,
    recipientName: giftCardData.recipientName,
    recipientEmail: giftCardData.recipientEmail,
    purchaseDate: giftCardData.orderDate,
    expiryDate: giftCardData.expiryDate,
    message: giftCardData.message || '',
    status: GiftCardStatus.ACTIVE,
    history: [
      {
        date: new Date().toISOString(),
        action: 'created',
        amount: parseFloat(giftCardData.amount),
        balance: parseFloat(giftCardData.amount),
        note: 'Gift card created'
      }
    ]
  };
  
  db.giftCards.push(newGiftCard);
  saveGiftCardDB(db);
  
  return newGiftCard;
}

// Get all gift cards
export function getAllGiftCards() {
  const db = initializeGiftCardDB();
  return db.giftCards;
}

// Get gift card by code
export function getGiftCardByCode(code) {
  const db = initializeGiftCardDB();
  return db.giftCards.find(card => card.code === code) || null;
}

// Get gift card by ID
export function getGiftCardById(id) {
  const db = initializeGiftCardDB();
  return db.giftCards.find(card => card.id === id) || null;
}

// Update gift card status
export function updateGiftCardStatus(id, newStatus) {
  const db = initializeGiftCardDB();
  const giftCard = db.giftCards.find(card => card.id === id);
  
  if (!giftCard) {
    return null;
  }
  
  const previousStatus = giftCard.status;
  giftCard.status = newStatus;
  
  giftCard.history.push({
    date: new Date().toISOString(),
    action: 'status_update',
    previousStatus,
    newStatus,
    balance: giftCard.currentAmount,
    note: `Status changed from ${previousStatus} to ${newStatus}`
  });
  
  saveGiftCardDB(db);
  return giftCard;
}

// Update gift card amount
export function updateGiftCardAmount(id, newAmount, note = '') {
  const db = initializeGiftCardDB();
  const giftCard = db.giftCards.find(card => card.id === id);
  
  if (!giftCard) {
    return null;
  }
  
  console.log(`Updating gift card ${id} amount from ${giftCard.currentAmount} to ${newAmount}`);
  
  // Convert to number to ensure valid comparison
  const previousAmount = parseFloat(giftCard.currentAmount);
  const numericNewAmount = parseFloat(newAmount);
  
  // Update the amount
  giftCard.currentAmount = numericNewAmount;
  
  // Determine if status should change
  let statusChanged = false;
  const previousStatus = giftCard.status;
  
  // If the new amount is 0, mark as exhausted regardless of previous status
  if (numericNewAmount === 0) {
    giftCard.status = GiftCardStatus.EXHAUSTED;
    statusChanged = giftCard.status !== previousStatus;
    console.log(`Gift card ${id} marked as exhausted because amount is now 0`);
  }
  
  // Add history entry for amount update
  giftCard.history.push({
    date: new Date().toISOString(),
    action: 'amount_update',
    previousAmount,
    newAmount: numericNewAmount,
    balance: numericNewAmount,
    note: note || 'Amount updated'
  });
  
  // Add history entry for status change if it happened
  if (statusChanged) {
    giftCard.history.push({
      date: new Date().toISOString(),
      action: 'status_update',
      previousStatus,
      newStatus: giftCard.status,
      balance: numericNewAmount,
      note: `Status changed from ${previousStatus} to ${giftCard.status} due to amount update`
    });
  }
  
  saveGiftCardDB(db);
  return giftCard;
}

// Automatically update expired gift cards
export function updateExpiredGiftCards() {
  const db = initializeGiftCardDB();
  const today = new Date();
  let updatedCount = 0;
  
  db.giftCards.forEach(card => {
    // Skip cards that are already marked as expired, exhausted, or closed
    if (card.status !== GiftCardStatus.ACTIVE) {
      return;
    }
    
    // Parse the expiry date (assumes ISO or YYYY-MM-DD format)
    const expiryDate = new Date(card.expiryDate);
    
    // Check if the card is expired
    if (expiryDate < today) {
      const previousStatus = card.status;
      card.status = GiftCardStatus.EXPIRED;
      
      card.history.push({
        date: today.toISOString(),
        action: 'status_update',
        previousStatus,
        newStatus: GiftCardStatus.EXPIRED,
        balance: card.currentAmount,
        note: 'Automatically marked as expired'
      });
      
      updatedCount++;
    }
  });
  
  if (updatedCount > 0) {
    saveGiftCardDB(db);
    console.log(`Updated ${updatedCount} expired gift cards`);
  }
  
  return updatedCount;
}

export default {
  GiftCardStatus,
  initializeGiftCardDB,
  saveGiftCardDB,
  addGiftCard,
  getAllGiftCards,
  getGiftCardByCode,
  getGiftCardById,
  updateGiftCardStatus,
  updateGiftCardAmount,
  updateExpiredGiftCards
}; 