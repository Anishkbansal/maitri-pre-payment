import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function PaymentCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment_intent_client_secret from URL
        const clientSecret = searchParams.get('payment_intent_client_secret');
        const paymentType = searchParams.get('payment_type') || 'unknown';
        
        if (!clientSecret) {
          setStatus('error');
          setMessage('Invalid payment session. Missing client secret.');
          return;
        }
        
        // Check payment status with Stripe
        const stripe = await import('@stripe/stripe-js').then(module => module.loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY));
        
        if (!stripe) {
          setStatus('error');
          setMessage('Could not initialize Stripe.');
          return;
        }
        
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        
        if (paymentIntent.status === 'succeeded') {
          setStatus('success');
          setMessage('Payment successful! Thank you for your purchase.');
          
          // Redirect after 3 seconds
          setTimeout(() => {
            if (paymentType === 'gift-card') {
              navigate('/gift-cards');
            } else {
              navigate('/shop');
            }
          }, 3000);
        } else {
          setStatus('error');
          setMessage(`Payment ${paymentIntent.status}. Please try again or contact support.`);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        setStatus('error');
        setMessage('An error occurred while processing your payment. Please try again or contact support.');
      }
    };
    
    processPayment();
  }, [searchParams, navigate]);

  return (
    <Layout>
      <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-yellow-600 mx-auto animate-spin" />
              <h1 className="text-2xl font-semibold mt-6 mb-2">Processing Payment</h1>
              <p className="text-gray-600">Please wait while we complete your transaction...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-2xl font-semibold mt-6 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">Your payment has been successfully processed.</p>
              <p className="text-sm text-gray-500">You will be redirected in a few seconds...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h1 className="text-2xl font-semibold mt-6 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Return to Shop
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
} 