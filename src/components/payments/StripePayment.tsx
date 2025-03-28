import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import { Loader2, CreditCard, Info } from 'lucide-react';
import { createPaymentIntent } from '../../utils/payment';

// Initialize Stripe with the public key from environment variables
// Fallback to a safe empty string if not found, to avoid runtime errors
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
console.log('Stripe Public Key:', stripePublicKey.substring(0, 10) + '...');
const stripePromise = loadStripe(stripePublicKey);

// Pricing constants
const KLARNA_MIN_AMOUNT = 300; // £300 minimum for Klarna

// Country code mapping for Klarna
const COUNTRY_TO_CODE: Record<string, string> = {
  'united kingdom': 'GB',
  'great britain': 'GB',
  'uk': 'GB',
  'united states': 'US',
  'usa': 'US',
  'germany': 'DE',
  'spain': 'ES'
};

/**
 * TESTING INSTRUCTIONS
 * 
 * === CREDIT/DEBIT CARD TESTING ===
 * 
 * For Stripe Card Testing (Credit or Debit):
 * - Card Number: 4242 4242 4242 4242 (for successful payment)
 * - Card Number: 4000 0000 0000 0069 (for declined payment)
 * - Expiration: Any future date (e.g., 12/28)
 * - CVC: Any 3 digits (e.g., 123)
 * - Name: Must match the name you entered in checkout
 * 
 * === KLARNA TESTING (Orders above £3) ===
 * 
 * For Klarna Testing:
 * - Klarna is only available for orders over £3
 * - Supported countries: UK, US, Germany, etc. (check README for full list)
 * - Test steps:
 *   1. Enter checkout information with total over £3
 *   2. Select supported country (UK, US, Germany, etc.)
 *   3. Click "Pay with Klarna" button on payment screen
 *   4. In Klarna test environment:
 *     - Use code "123456" for any verification steps
 *     - For UK: Select "Pay Now" option
 *     - Complete the test flow to return to the shop
 */

// StripePaymentForm component (internal)
const StripePaymentForm = ({
  amount,
  currency = 'gbp',
  description,
  metadata = {},
  customerEmail,
  customerCountry,
  paymentType,
  onPaymentSuccess,
  onPaymentError,
}: {
  amount: number;
  currency?: string;
  description: string;
  metadata?: Record<string, string>;
  customerEmail: string;
  customerCountry: string;
  paymentType: 'product' | 'gift-card';
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: Error) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [isKlarnaAvailable, setIsKlarnaAvailable] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'klarna'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');
  
  // Check if Klarna should be available based on amount
  const showKlarnaOption = amount >= KLARNA_MIN_AMOUNT;

  // Create payment intent when component mounts
  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        const result = await createPaymentIntent({
          amount,
          currency,
          description,
          metadata,
          customerEmail,
          customerCountry,
          paymentType,
        });

        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        setIsKlarnaAvailable(result.isKlarnaAvailable);
        
        // If Klarna is not available, show the reason in console
        if (!result.isKlarnaAvailable && showKlarnaOption) {
          console.log('Klarna not available from server. Amount:', amount, 'Country:', customerCountry);
        }
      } catch (err) {
        setError((err as Error).message);
        onPaymentError(err as Error);
      }
    };

    getPaymentIntent();
  }, [amount, currency, description, metadata, customerEmail, customerCountry, paymentType, onPaymentError, showKlarnaOption]);

  // Setup payment request button (Apple Pay, Google Pay)
  useEffect(() => {
    if (stripe && clientSecret) {
      const pr = stripe.paymentRequest({
        country: 'GB',
        currency: currency.toLowerCase(),
        total: {
          label: description,
          amount: Math.round(amount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      pr.on('paymentmethod', async (ev) => {
        setIsProcessing(true);
        
        try {
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

          if (confirmError) {
            ev.complete('fail');
            setError(confirmError.message || 'Payment failed');
            onPaymentError(new Error(confirmError.message || 'Payment failed'));
          } else {
            ev.complete('success');
            if (paymentIntent.status === 'requires_action') {
              const { error, paymentIntent: updatedIntent } = await stripe.confirmCardPayment(clientSecret);
              if (error) {
                setError(error.message || 'Payment failed');
                onPaymentError(new Error(error.message || 'Payment failed'));
              } else if (updatedIntent.status === 'succeeded') {
                onPaymentSuccess(paymentIntentId);
              }
            } else if (paymentIntent.status === 'succeeded') {
              onPaymentSuccess(paymentIntentId);
            }
          }
        } catch (err) {
          ev.complete('fail');
          setError((err as Error).message);
          onPaymentError(err as Error);
        } finally {
          setIsProcessing(false);
        }
      });
    }
  }, [stripe, clientSecret, amount, currency, description, paymentIntentId, onPaymentSuccess, onPaymentError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Handle different payment methods
      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement);
        
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        // Validate cardholder name isn't empty
        if (!cardholderName.trim()) {
          throw new Error('Please enter the cardholder name');
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
              email: customerEmail,
            },
          },
        });

        if (error) {
          throw new Error(error.message || 'Payment failed');
        } else if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntentId);
        } else {
          throw new Error(`Payment status: ${paymentIntent.status}`);
        }
      } else if (paymentMethod === 'klarna') {
        // Get the correct country code for Klarna
        let countryCode = 'GB'; // Default to UK
        if (customerCountry) {
          const normalizedCountry = customerCountry.toLowerCase();
          if (COUNTRY_TO_CODE[normalizedCountry]) {
            countryCode = COUNTRY_TO_CODE[normalizedCountry];
          } else if (normalizedCountry.length === 2) {
            countryCode = normalizedCountry.toUpperCase();
          }
        }
        
        const { error, paymentIntent } = await stripe.confirmKlarnaPayment(
          clientSecret,
          {
            payment_method: {
              billing_details: {
                name: cardholderName,
                email: customerEmail,
                address: {
                  country: countryCode,
                  line1: metadata?.address || '',
                  city: metadata?.city || '',
                  postal_code: metadata?.postcode || '',
                  state: metadata?.state || '',
                }
              },
            },
            return_url: `${window.location.origin}/payment-complete`,
          }
        );

        if (error) {
          throw new Error(error.message || 'Klarna payment failed');
        } else if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntentId);
        } else {
          // For Klarna, we may need to redirect the customer
          console.log('Klarna payment status:', paymentIntent.status);
        }
      }
    } catch (err) {
      setError((err as Error).message);
      onPaymentError(err as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="stripe-payment-form p-6 border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Payment method selection */}
        <div className="space-y-3">
          <div className="text-lg font-semibold mb-2">Payment Method</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`py-3 px-5 rounded-md border transition-colors flex-1 flex items-center justify-center gap-3 text-md
                ${paymentMethod === 'card' 
                  ? 'bg-yellow-50 border-yellow-600 text-yellow-700' 
                  : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <CreditCard className="w-6 h-6" />
              Credit or Debit Card
            </button>
            
            {isKlarnaAvailable && showKlarnaOption && (
              <button
                type="button"
                onClick={() => setPaymentMethod('klarna')}
                className={`py-3 px-5 rounded-md border transition-colors flex-1 flex items-center justify-center gap-3 text-md
                  ${paymentMethod === 'klarna' 
                    ? 'bg-pink-50 border-pink-500 text-pink-700' 
                    : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M19.7959 6H4.20408C3.54013 6 3 6.53726 3 7.2V16.8C3 17.4627 3.54013 18 4.20408 18H19.7959C20.4599 18 21 17.4627 21 16.8V7.2C21 6.53726 20.4599 6 19.7959 6Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 12.5C9 13.3284 8.32843 14 7.5 14C6.67157 14 6 13.3284 6 12.5C6 11.6716 6.67157 11 7.5 11C8.32843 11 9 11.6716 9 12.5Z" fill="currentColor" />
                  <path d="M14.5 14C15.3284 14 16 13.3284 16 12.5C16 11.6716 15.3284 11 14.5 11C13.6716 11 13 11.6716 13 12.5C13 13.3284 13.6716 14 14.5 14Z" fill="currentColor" />
                </svg>
                Pay with Klarna
              </button>
            )}
          </div>
          
          {showKlarnaOption && !isKlarnaAvailable && (
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Info size={16} />
              <span>Klarna is currently unavailable for your selected country. Supported countries include UK, US, Germany, and other EU countries.</span>
            </div>
          )}
          
          {!showKlarnaOption && (
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Info size={16} />
              <span>Klarna payments are only available for orders over £{KLARNA_MIN_AMOUNT.toFixed(2)}.</span>
            </div>
          )}
        </div>
        
        {/* Apple Pay / Google Pay */}
        {paymentRequest && (
          <div className="py-3">
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    theme: 'dark',
                    height: '48px',
                  },
                },
              }}
            />
            <div className="text-center text-gray-500 text-sm mt-3">or pay with details below</div>
          </div>
        )}

        {/* Card payment form */}
        {paymentMethod === 'card' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Name on card"
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
              <p className="text-sm text-gray-500">Please enter the name exactly as it appears on your card</p>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Card Details</label>
              <div className="border rounded-md p-4">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#32325d',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                        padding: '10px 0',
                      },
                      invalid: {
                        color: '#dc2626',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">We accept both credit and debit cards from all major providers</p>
              
              <div className="bg-blue-50 p-3 rounded-md text-blue-800 text-sm">
                <p className="font-medium">Test Card Numbers:</p>
                <p>Success: 4242 4242 4242 4242</p>
                <p>Decline: 4000 0000 0000 0002</p>
                <p>Use any future date and any 3 digits for CVC</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full bg-yellow-600 text-white py-4 rounded-md hover:bg-yellow-700 transition-colors duration-150 flex items-center justify-center text-lg font-medium disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${currency.toUpperCase()} ${amount.toFixed(2)}`
              )}
            </button>
          </div>
        )}

        {/* Klarna payment option */}
        {paymentMethod === 'klarna' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Your full name"
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="bg-pink-50 p-5 rounded-md text-pink-800">
              <h3 className="font-medium text-lg mb-2">Pay later with Klarna</h3>
              <p className="text-sm mb-3">You'll be redirected to Klarna to complete your purchase securely.</p>
            </div>

            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full bg-pink-500 text-white py-4 rounded-md hover:bg-pink-600 transition-colors duration-150 flex items-center justify-center text-lg font-medium disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Processing Klarna Payment...
                </>
              ) : (
                `Pay with Klarna`
              )}
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            <p className="font-medium">Payment Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Secure payment note */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>Your payment is secure and encrypted. We never store your full card details.</p>
          <p className="mt-1">The billing address will use your shipping address details.</p>
        </div>
      </form>
    </div>
  );
};

// Main StripePayment component (wrapper with Elements provider)
const StripePayment = (props: {
  amount: number;
  currency?: string;
  description: string;
  metadata?: Record<string, string>;
  customerEmail: string;
  customerCountry: string;
  paymentType: 'product' | 'gift-card';
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: Error) => void;
}) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment; 