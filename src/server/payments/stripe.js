import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Klarna configuration - Set minimum amount to £3 (300 pence)
const KLARNA_MIN_AMOUNT = parseInt(process.env.VITE_KLARNA_MIN_AMOUNT || '300', 10);
const ENABLE_KLARNA = process.env.VITE_ENABLE_KLARNA !== 'false'; // Enable by default unless explicitly set to false

// Supported Klarna countries with both 2-letter codes and full names
// Reference: https://stripe.com/docs/payments/klarna
const KLARNA_SUPPORTED_COUNTRIES = [
  'AT', // Austria
  'BE', // Belgium
  'DK', // Denmark
  'FI', // Finland
  'DE', // Germany
  'IT', // Italy
  'NL', // Netherlands
  'NO', // Norway
  'ES', // Spain
  'SE', // Sweden
  'GB', // United Kingdom
  'US', // United States
];

// Country name to ISO code mapping for common cases
const COUNTRY_NAME_TO_CODE = {
  'united kingdom': 'GB',
  'great britain': 'GB',
  'uk': 'GB',
  'united states': 'US',
  'usa': 'US',
  'germany': 'DE',
  'spain': 'ES',
  'sweden': 'SE',
  'italy': 'IT',
  'austria': 'AT',
  'belgium': 'BE',
  'denmark': 'DK',
  'finland': 'FI',
  'netherlands': 'NL',
  'norway': 'NO',
};

/**
 * Create a payment intent for a transaction
 * 
 * @param {Object} options Payment options
 * @param {number} options.amount Amount in the smallest currency unit (e.g., cents for USD/EUR)
 * @param {string} options.currency Currency code (e.g., 'usd', 'eur')
 * @param {string} options.description Description of the payment
 * @param {Object} options.metadata Additional metadata for the payment
 * @param {string} options.customerEmail Customer email for receipts
 * @param {string} options.customerCountry Customer country code for determining payment methods
 * @returns {Promise<Object>} Stripe payment intent
 */
async function createPaymentIntent({ 
  amount, 
  currency = 'gbp', 
  description, 
  metadata = {}, 
  customerEmail,
  customerCountry
}) {
  try {
    // Calculate amount in smallest currency unit (cents/pence)
    const amountInSmallestUnit = Math.round(amount * 100);

    // Normalize country code (handle full country names)
    let countryCode = customerCountry;
    if (customerCountry) {
      // Convert to lowercase for case-insensitive matching
      const normalizedCountry = customerCountry.toLowerCase();
      
      // Check if it's a full country name and convert to ISO code
      if (COUNTRY_NAME_TO_CODE[normalizedCountry]) {
        countryCode = COUNTRY_NAME_TO_CODE[normalizedCountry];
      }
    }

    // Determine if Klarna should be available
    const isKlarnaAvailable = shouldOfferKlarna(amountInSmallestUnit, countryCode);
    
    // Always include both credit and debit cards as payment methods
    const paymentMethodTypes = ['card']; // 'card' covers both credit and debit cards
    
    // Add Klarna if available
    if (isKlarnaAvailable) {
      paymentMethodTypes.push('klarna');
      console.log('Klarna payment option is enabled for this transaction');
    } else {
      console.log('Klarna payment option is NOT available for this transaction:', 
                  { amount: amountInSmallestUnit / 100, 
                    minAmount: KLARNA_MIN_AMOUNT / 100, 
                    country: countryCode || customerCountry, 
                    enabled: ENABLE_KLARNA });
    }
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency,
      description,
      metadata: {
        ...metadata,
        payment_methods_offered: paymentMethodTypes.join(','),
        debit_card_enabled: 'true', // Explicitly note that debit cards are enabled
      },
      payment_method_types: paymentMethodTypes,
      receipt_email: customerEmail,
    });

    console.log(`Payment intent created: ${paymentIntent.id} with payment methods: ${paymentMethodTypes.join(', ')}`);

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isKlarnaAvailable
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Determine if Klarna should be offered as a payment method
 * 
 * @param {number} amountInSmallestUnit Amount in smallest currency unit (cents/pence)
 * @param {string} countryCode ISO country code
 * @returns {boolean} Whether Klarna should be offered
 */
function shouldOfferKlarna(amountInSmallestUnit, countryCode) {
  // Only offer Klarna if enabled in config
  if (!ENABLE_KLARNA) {
    console.log('Klarna disabled in configuration');
    return false;
  }
  
  // Only offer Klarna for amounts above the minimum threshold
  if (amountInSmallestUnit < KLARNA_MIN_AMOUNT) {
    console.log(`Amount ${amountInSmallestUnit / 100} below Klarna minimum ${KLARNA_MIN_AMOUNT / 100}`);
    return false;
  }
  
  // Only offer Klarna for supported countries
  if (!countryCode) {
    console.log('No country code provided for Klarna check');
    return false;
  }
  
  const countryCodeUpper = countryCode.toUpperCase();
  if (!KLARNA_SUPPORTED_COUNTRIES.includes(countryCodeUpper)) {
    console.log(`Country ${countryCodeUpper} not supported by Klarna`);
    return false;
  }
  
  return true;
}

/**
 * Retrieve a payment intent
 * 
 * @param {string} paymentIntentId ID of the payment intent to retrieve
 * @returns {Promise<Object>} Stripe payment intent
 */
async function retrievePaymentIntent(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent
    };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Handle webhook events from Stripe
 * 
 * @param {string} requestBody Raw request body from the webhook
 * @param {string} signature Stripe signature header
 * @returns {Promise<Object>} Processed event
 */
async function handleWebhookEvent(requestBody, signature) {
  try {
    const event = stripe.webhooks.constructEvent(
      requestBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
        // Handle successful payment (update database, send emails, etc.)
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`PaymentIntent ${failedPayment.id} failed`);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return {
      success: true,
      event
    };
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  createPaymentIntent,
  retrievePaymentIntent,
  handleWebhookEvent,
  shouldOfferKlarna
}; 