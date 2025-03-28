import express from 'express';
import giftCardDb from '../db/giftCards.js';
import * as emailService from '../emails/index.js';

const router = express.Router();

// Get all gift cards
router.get('/', (req, res) => {
  try {
    const giftCards = giftCardDb.getAllGiftCards();
    res.status(200).json({ success: true, data: giftCards });
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gift cards' });
  }
});

// Get gift card by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const giftCard = giftCardDb.getGiftCardById(id);
    
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }
    
    res.status(200).json({ success: true, data: giftCard });
  } catch (error) {
    console.error(`Error fetching gift card ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Failed to fetch gift card' });
  }
});

// Update gift card amount
router.put('/:id/amount', async (req, res) => {
  try {
    console.log(`Received update request for gift card ${req.params.id}:`, req.body);
    
    const { id } = req.params;
    const { currentAmount, amount, note } = req.body;
    
    // Use currentAmount if provided, otherwise fall back to amount
    const newAmount = currentAmount !== undefined ? currentAmount : amount;
    
    // Validate the new amount
    if (newAmount === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing amount value. Please provide currentAmount or amount.' 
      });
    }
    
    // Parse newAmount to a number if it's a string
    const numericNewAmount = parseFloat(newAmount);
    
    // Validate that the amount is a number
    if (isNaN(numericNewAmount)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount value. Amount must be a number.' 
      });
    }
    
    // Validate that the amount is not negative
    if (numericNewAmount < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount value. Amount cannot be negative.' 
      });
    }
    
    // Get the gift card
    const giftCard = giftCardDb.getGiftCardById(id);
    
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }
    
    // Only allow updates if the gift card is active or if the new amount is zero (which will mark it as exhausted)
    if (giftCard.status !== giftCardDb.GiftCardStatus.ACTIVE && numericNewAmount !== 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot update amount for gift card with status: ${giftCard.status}`
      });
    }
    
    // Update the gift card amount
    const previousAmount = giftCard.currentAmount;
    const updatedGiftCard = giftCardDb.updateGiftCardAmount(id, numericNewAmount, note);
    
    if (!updatedGiftCard) {
      return res.status(500).json({ success: false, message: 'Failed to update gift card amount' });
    }
    
    // Send email notification
    try {
      await emailService.sendGiftCardUpdateEmail(updatedGiftCard, 'amount_update', {
        previousAmount,
        newAmount: numericNewAmount
      });
    } catch (emailError) {
      console.error('Error sending gift card update email:', emailError);
      // Continue with the response even if email fails
    }
    
    res.status(200).json({ success: true, data: updatedGiftCard });
  } catch (error) {
    console.error(`Error updating gift card ${req.params.id} amount:`, error);
    res.status(500).json({ success: false, message: 'Failed to update gift card amount' });
  }
});

// Update gift card status (close gift card)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    // Validate the status
    const validStatuses = Object.values(giftCardDb.GiftCardStatus);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` 
      });
    }
    
    // Get the gift card
    const giftCard = giftCardDb.getGiftCardById(id);
    
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }
    
    // Don't allow changing status back to active
    if (status === giftCardDb.GiftCardStatus.ACTIVE && giftCard.status !== giftCardDb.GiftCardStatus.ACTIVE) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status back to active from ${giftCard.status}`
      });
    }
    
    // Update the gift card status
    const previousStatus = giftCard.status;
    const updatedGiftCard = giftCardDb.updateGiftCardStatus(id, status);
    
    if (!updatedGiftCard) {
      return res.status(500).json({ success: false, message: 'Failed to update gift card status' });
    }
    
    // Send email notification
    try {
      await emailService.sendGiftCardUpdateEmail(updatedGiftCard, 'status_update', {
        previousStatus,
        newStatus: status
      });
    } catch (emailError) {
      console.error('Error sending gift card update email:', emailError);
      // Continue with the response even if email fails
    }
    
    res.status(200).json({ success: true, data: updatedGiftCard });
  } catch (error) {
    console.error(`Error updating gift card ${req.params.id} status:`, error);
    res.status(500).json({ success: false, message: 'Failed to update gift card status' });
  }
});

// Send gift card emails
router.post('/send-gift-card-emails', async (req, res) => {
  try {
    const giftCardData = req.body;
    
    // Validate required fields
    const requiredFields = ['giftCode', 'amount', 'buyerName', 'buyerEmail', 'recipientName', 'recipientEmail', 'orderDate', 'expiryDate'];
    const missingFields = requiredFields.filter(field => !giftCardData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email service not configured, skipping email sending');
      return res.status(200).json({
        success: true,
        message: 'Email service not configured, skipping email sending'
      });
    }
    
    // Send emails
    const result = await emailService.sendGiftCardEmails(giftCardData);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error sending gift card emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send gift card emails',
      error: error.message
    });
  }
});

export default router; 