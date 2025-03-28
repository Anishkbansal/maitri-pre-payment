import express from 'express';
import stripeService from '../payments/stripe.js';
import giftCardDb from '../db/giftCards.js';
import * as emailService from '../emails/index.js';
import { transporter } from '../config/index.js';

const router = express.Router();

/**
 * Create a payment intent
 * POST /api/payments/create-payment-intent
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, description, metadata, customerEmail, customerCountry, paymentType } = req.body;
    
    console.log('Creating payment intent:', { 
      amount, 
      currency, 
      paymentType, 
      customerCountry,
      hasEmail: !!customerEmail 
    });
    
    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    
    if (!customerEmail) {
      return res.status(400).json({ success: false, message: 'Customer email is required' });
    }
    
    // Create payment intent
    const result = await stripeService.createPaymentIntent({
      amount,
      currency,
      description,
      metadata: {
        ...metadata,
        paymentType,
      },
      customerEmail,
      customerCountry,
    });
    
    if (!result.success) {
      console.error('Failed to create payment intent:', result.error);
      return res.status(400).json({ success: false, message: result.error });
    }
    
    console.log(`Payment intent created successfully: ${result.paymentIntentId}`);
    console.log(`Klarna available: ${result.isKlarnaAvailable}`);
    
    res.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      isKlarnaAvailable: result.isKlarnaAvailable
    });
  } catch (error) {
    console.error('Error in create-payment-intent route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Complete a gift card payment
 * POST /api/payments/complete-gift-card-payment
 */
router.post('/complete-gift-card-payment', async (req, res) => {
  try {
    const { paymentIntentId, giftCardData } = req.body;
    
    console.log(`Processing gift card payment: ${paymentIntentId}`);
    
    // Retrieve payment intent to verify payment was successful
    const paymentResult = await stripeService.retrievePaymentIntent(paymentIntentId);
    
    if (!paymentResult.success) {
      console.error('Failed to retrieve payment intent:', paymentResult.error);
      return res.status(400).json({ success: false, message: paymentResult.error });
    }
    
    const paymentIntent = paymentResult.paymentIntent;
    
    // Verify payment was successful
    if (paymentIntent.status !== 'succeeded') {
      console.error(`Payment not successful, current status: ${paymentIntent.status}`);
      return res.status(400).json({ 
        success: false, 
        message: `Payment not successful, current status: ${paymentIntent.status}` 
      });
    }
    
    console.log(`Gift card payment confirmed: ${paymentIntentId}`);
    
    // Send confirmation emails
    const emailResult = await emailService.sendGiftCardEmails(giftCardData);
    
    if (!emailResult.success) {
      console.warn(`Gift card payment successful but email sending failed: ${emailResult.message}`);
    } else {
      console.log(`Gift card emails sent: ${emailResult.message}`);
    }
    
    // Return successful response
    res.json({
      success: true,
      giftCard: {
        id: `gc_${Date.now()}`,
        ...giftCardData,
        paymentId: paymentIntentId,
        paymentDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in complete-gift-card-payment route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Complete a product order
 * POST /api/payments/complete-product-order
 */
router.post('/complete-product-order', async (req, res) => {
  try {
    const { paymentIntentId, orderData } = req.body;
    
    console.log(`Processing product order: ${paymentIntentId}`);
    console.log('Order details:', {
      quantity: orderData.quantity,
      totalPrice: orderData.totalPrice,
      isUKDelivery: orderData.isUKDelivery,
      country: orderData.formData?.country,
    });
    
    // Retrieve payment intent to verify payment was successful
    const paymentResult = await stripeService.retrievePaymentIntent(paymentIntentId);
    
    if (!paymentResult.success) {
      console.error('Failed to retrieve payment intent:', paymentResult.error);
      return res.status(400).json({ success: false, message: paymentResult.error });
    }
    
    const paymentIntent = paymentResult.paymentIntent;
    
    // Verify payment was successful
    if (paymentIntent.status !== 'succeeded') {
      console.error(`Payment not successful, current status: ${paymentIntent.status}`);
      return res.status(400).json({ 
        success: false, 
        message: `Payment not successful, current status: ${paymentIntent.status}` 
      });
    }
    
    console.log(`Product order payment confirmed: ${paymentIntentId}`);
    
    // Return successful response
    res.json({
      success: true,
      order: {
        id: `ord_${Date.now()}`,
        ...orderData,
        paymentId: paymentIntentId,
        paymentMethod: paymentIntent.payment_method_types?.join(',') || 'card',
        paymentDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in complete-product-order route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Send order confirmation emails
 * POST /api/payments/send-order-emails
 */
router.post('/send-order-emails', async (req, res) => {
  try {
    const orderData = req.body;
    
    console.log('Sending order confirmation emails');
    
    // Validate required fields
    if (!orderData.formData || !orderData.formData.email) {
      console.error('Missing customer email in order data');
      return res.status(400).json({ success: false, message: 'Customer email is required' });
    }
    
    // Send emails
    const result = await emailService.sendOrderEmails(orderData);
    
    if (!result.success) {
      console.error('Failed to send order emails:', result.message);
      return res.status(400).json({ success: false, message: result.message });
    }
    
    console.log(`Order emails sent: ${result.message}`);
    
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error in send-order-emails route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Send gift card emails
 * POST /api/payments/send-gift-card-emails
 */
router.post('/send-gift-card-emails', async (req, res) => {
  try {
    const orderData = req.body;
    
    console.log('Sending gift card emails');
    
    // Send emails
    const result = await emailService.sendGiftCardEmails(orderData.formData);
    
    if (!result.success) {
      console.error('Failed to send gift card emails:', result.message);
      return res.status(400).json({ success: false, message: result.message });
    }
    
    console.log(`Gift card emails sent: ${result.message}`);
    
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error in send-gift-card-emails route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Test email sending
 * GET /api/payments/test-email
 */
router.get('/test-email', async (req, res) => {
  try {
    console.log('Testing email configuration');
    
    // Log email configuration for debugging
    console.log('Email config:', {
      user: process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      adminEmails: process.env.ADMIN_EMAILS
    });
    
    // Basic test email
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'Test Email from Maitri',
      html: `
        <h1>Email Test</h1>
        <p>This is a test email to verify the email sending functionality.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    };
    
    // Test if the transporter is working
    try {
      const info = await transporter.sendMail(testMailOptions);
      console.log('Test email sent:', info.response);
      
      // Send a response with details about the configuration
      return res.json({
        success: true,
        message: 'Test email sent successfully',
        emailConfig: {
          service: 'gmail',
          user: process.env.EMAIL_USER,
          hasPassword: !!process.env.EMAIL_PASS,
          adminEmails: process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').length : 0
        }
      });
    } catch (emailError) {
      console.error('Test email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Test email failed to send',
        error: emailError.message,
        emailConfig: {
          service: 'gmail',
          user: process.env.EMAIL_USER,
          hasPassword: !!process.env.EMAIL_PASS,
          adminEmails: process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').length : 0
        }
      });
    }
  } catch (error) {
    console.error('Error in test-email route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Direct test for order emails
 * GET /api/payments/test-order-email
 */
router.get('/test-order-email', async (req, res) => {
  try {
    console.log('Testing order email sending');
    
    // Create sample order data
    const sampleOrderData = {
      formData: {
        firstName: 'Test',
        lastName: 'Customer',
        email: process.env.EMAIL_USER, // Send to self for testing
        phone: '+1234567890',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postcode: '12345',
        country: 'United Kingdom'
      },
      quantity: 1,
      totalPrice: 350,
      isUKDelivery: true
    };
    
    console.log('Sample order data:', sampleOrderData);
    
    // Directly call sendOrderEmails
    try {
      console.log('Calling emailService.sendOrderEmails');
      if (typeof emailService.sendOrderEmails !== 'function') {
        console.error('emailService.sendOrderEmails is not a function', typeof emailService.sendOrderEmails);
        console.log('Available email service functions:', Object.keys(emailService));
        
        return res.status(500).json({
          success: false,
          message: 'Email service not properly loaded',
          availableFunctions: Object.keys(emailService)
        });
      }
      
      const emailResult = await emailService.sendOrderEmails(sampleOrderData);
      console.log('Order email result:', emailResult);
      
      return res.json({
        success: true,
        message: 'Test order email sent successfully',
        result: emailResult
      });
    } catch (emailError) {
      console.error('Test order email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Test order email failed to send',
        error: emailError.message || emailError.toString()
      });
    }
  } catch (error) {
    console.error('Error in test-order-email route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing Stripe signature' });
    }
    
    const result = await stripeService.handleWebhookEvent(req.body, signature);
    
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ success: false, message: 'Failed to handle webhook' });
  }
});

// Helper function to generate a random gift code
function generateGiftCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default router; 