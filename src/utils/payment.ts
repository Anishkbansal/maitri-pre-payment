// Define the API base URL dynamically based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Create a payment intent with the Stripe API
 * 
 * @param {Object} paymentData Payment data for creating intent
 * @returns {Promise<{ clientSecret: string, paymentIntentId: string, isKlarnaAvailable: boolean }>} Payment intent details
 */
export async function createPaymentIntent(paymentData: {
  amount: number;
  currency?: string;
  description: string;
  metadata?: Record<string, string>;
  customerEmail: string;
  customerCountry: string;
  paymentType: 'product' | 'gift-card';
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create payment intent: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create payment intent');
    }
    
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
      isKlarnaAvailable: data.isKlarnaAvailable
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Complete a gift card payment after successful payment
 * 
 * @param {Object} data Gift card and payment data
 * @returns {Promise<Object>} Completed gift card data
 */
export async function completeGiftCardPayment(data: {
  paymentIntentId: string;
  giftCardData: any;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/complete-gift-card-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to complete gift card payment: ${errorText}`);
    }
    
    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.message || 'Failed to complete gift card payment');
    }
    
    return responseData.giftCard;
  } catch (error) {
    console.error('Error completing gift card payment:', error);
    throw error;
  }
}

/**
 * Complete a product order after successful payment
 * 
 * @param {Object} data Order and payment data
 * @returns {Promise<Object>} Completed order data
 */
export async function completeProductOrder(data: {
  paymentIntentId: string;
  orderData: any;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/complete-product-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to complete product order: ${errorText}`);
    }
    
    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.message || 'Failed to complete product order');
    }
    
    return responseData.order;
  } catch (error) {
    console.error('Error completing product order:', error);
    throw error;
  }
} 