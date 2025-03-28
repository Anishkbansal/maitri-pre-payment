import React, { useState, useEffect } from 'react';
import { sendGiftCardEmails } from '../utils/api';
import { Country, State, City } from 'country-state-city';
import { Loader2, Mail, X } from 'lucide-react';
import Toast from '../components/shop/Toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import StripePayment from '../components/payments/StripePayment';
import { completeGiftCardPayment } from '../utils/payment';

interface GiftCardFormData {
  buyerName: string;
  buyerEmail: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  message: string;
  giftCode: string;
  // Payment details
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

// Reusing restricted countries from Shop
const RESTRICTED_COUNTRIES = [
  "North Korea", "Iran", "Syria", "Cuba", "Venezuela", "Yemen", "Sudan", "Somalia", "Libya", "Myanmar"
];

export default function GiftCardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState(1); // Step 1: Gift info, Step 2: Payment
  const [sendingEmails, setSendingEmails] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  
  const [formData, setFormData] = useState<GiftCardFormData>({
    buyerName: '',
    buyerEmail: '',
    recipientName: '',
    recipientEmail: '',
    amount: 50,
    message: '',
    giftCode: '',
    // Payment details
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });

  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Initialize countries on component mount
  useEffect(() => {
    // Initialize countries
    const countries = Country.getAllCountries()
      .filter(country => !RESTRICTED_COUNTRIES.includes(country.name));
    
    setAvailableCountries(countries);
    
    // Set UK as default if available
    const uk = countries.find(country => country.isoCode === 'GB');
    if (uk) {
      handleCountryChange(uk);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply formatting for payment fields
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setFormData(prev => ({
        ...prev,
        amount: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
    }
    return numbers;
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleCountryChange = (country: any) => {
    setSelectedCountry(country);
    
    // Reset city
    setAvailableCities([]);
    
    setFormData(prev => ({
      ...prev,
      country: country.name,
      city: ''
    }));
    
    // Try to get cities directly for this country
    const cities = City.getCitiesOfCountry(country.isoCode) || [];
    setAvailableCities(cities);
  };

  const generateGiftCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Format as XXXX-XXXX-XX
    return `${result.substring(0, 4)}-${result.substring(4, 8)}-${result.substring(8, 10)}`;
  };

  const goToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate first form
    if (!formData.buyerName || !formData.buyerEmail || !formData.recipientName || !formData.recipientEmail || !formData.amount) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    // Auto-fill buyer name into payment form if empty
    if (!formData.firstName || !formData.lastName) {
      const nameParts = formData.buyerName.split(' ');
      if (nameParts.length > 1) {
        const lastName = nameParts.pop() || '';
        const firstName = nameParts.join(' ');
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName
        }));
      }
    }
    
    // Auto-fill buyer email if empty
    if (!formData.cardName) {
      setFormData(prev => ({
        ...prev,
        cardName: formData.buyerName
      }));
    }
    
    // Set email to buyer email by default
    setFormData(prev => ({
      ...prev,
      email: formData.buyerEmail
    }));
    
    setErrorMessage(null);
    setStep(2);
  };

  const goBackToGiftInfo = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Show the payment component instead of processing immediately
      setShowPayment(true);
    } catch (error) {
      console.error('Failed to process gift card:', error);
      setErrorMessage('There was an error processing your payment. Please try again.');
      setToast({
        message: 'Payment failed. Please try again.',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentIntentId(paymentId);
    setSendingEmails(true);
    
    try {
      // Generate gift code if not already set
      const giftCode = formData.giftCode || generateGiftCode();
      
      // Calculate expiration date (12 months from now)
      const orderDate = new Date();
      const expiryDate = new Date(orderDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      
      // Complete the gift card payment on the server
      const giftCardData = {
        ...formData,
        giftCode,
        orderDate: orderDate.toLocaleDateString(),
        expiryDate: expiryDate.toLocaleDateString()
      };
      
      await completeGiftCardPayment({
        paymentIntentId: paymentId,
        giftCardData
      });
      
      // Send emails
      await sendGiftCardEmails({ formData: giftCardData });
      
      setToast({
        message: 'Payment successful! Gift card details have been emailed.',
        type: 'success'
      });
      
      setIsSent(true);
    } catch (emailError) {
      console.error('Failed to send gift card emails:', emailError);
      setToast({
        message: 'Payment successful, but failed to send gift card emails.',
        type: 'info'
      });
    } finally {
      setSendingEmails(false);
      setIsLoading(false);
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setErrorMessage('There was an error processing your payment. Please try again.');
    setToast({
      message: 'Payment failed. Please try again.',
      type: 'error'
    });
    setIsLoading(false);
    setShowPayment(false);
  };
  
  const resetForm = () => {
    setIsSent(false);
    setFormData({
      buyerName: '',
      buyerEmail: '',
      recipientName: '',
      recipientEmail: '',
      amount: 50,
      message: '',
      giftCode: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      postcode: '',
      country: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      email: ''
    });
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Gift Cards</h1>
          <p className="text-xl text-gray-600">
            Give the gift of wellness to your loved ones
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Gift Card Info */}
            <div className="bg-yellow-600 p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Maitri Gift Card</h2>
              <div className="prose prose-lg text-white mb-6">
                <p>
                  Our gift cards are perfect for any occasion. They can be redeemed at our clinic for any therapy or treatment.
                </p>
                <ul className="space-y-2 mt-6">
                  <li>Personalized digital gift cards</li>
                  <li>Valid for 12 months from purchase</li>
                  <li>Redeemable for any service at our clinic</li>
                  <li>Include a personal message to the recipient</li>
                </ul>
              </div>
              <div className="mt-8">
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">How It Works</h3>
                  <ol className="space-y-3 list-decimal list-inside">
                    <li>Fill out the form with your details</li>
                    <li>Choose the gift amount</li>
                    <li>Add a personal message (optional)</li>
                    <li>Complete the payment</li>
                    <li>We'll email the gift card to both you and the recipient</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Gift Card Form */}
            <div className="p-8">
              {isSent ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                    <h3 className="text-xl font-bold mb-2">Gift Card Sent Successfully!</h3>
                    <p>The gift card details have been emailed to both you and the recipient.</p>
                  </div>
                  <button 
                    onClick={resetForm}
                    className="bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 font-medium"
                  >
                    Send Another Gift Card
                  </button>
                </div>
              ) : (
                <>
                  {step === 1 ? (
                    <form onSubmit={goToPayment} className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          name="buyerName"
                          value={formData.buyerName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                        <input
                          type="email"
                          name="buyerEmail"
                          value={formData.buyerEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800 mb-4 pt-4">Recipient Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient's Name</label>
                        <input
                          type="text"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient's Email</label>
                        <input
                          type="email"
                          name="recipientEmail"
                          value={formData.recipientEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gift Card Amount (£)</label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleAmountChange}
                          min="10"
                          max="1000"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Add a personal message for the recipient..."
                        />
                      </div>

                      {errorMessage && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-yellow-600 text-white py-3 rounded-md hover:bg-yellow-700 transition-colors duration-150 flex items-center justify-center text-lg font-medium"
                      >
                        Proceed to Payment
                      </button>
                    </form>
                  ) : (
                    <>
                      {!showPayment ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Payment Details</h3>
                            <button 
                              type="button"
                              onClick={goBackToGiftInfo}
                              className="text-sm text-yellow-600 hover:text-yellow-700"
                            >
                              &larr; Back to Gift Details
                            </button>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-md mb-6">
                            <h4 className="font-medium text-yellow-800 mb-2">Gift Card Summary</h4>
                            <p className="text-yellow-800">Amount: <span className="font-bold">£{formData.amount.toFixed(2)}</span></p>
                            <p className="text-yellow-800">Recipient: {formData.recipientName}</p>
                          </div>

                          {/* Personal Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                  type="text"
                                  name="firstName"
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                  type="text"
                                  name="lastName"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email || formData.buyerEmail}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <PhoneInput
                                  country={'gb'}
                                  value={formData.phone}
                                  onChange={handlePhoneChange}
                                  inputClass="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  containerClass="w-full"
                                  excludeCountries={RESTRICTED_COUNTRIES.map(country => 
                                    Country.getAllCountries().find(c => c.name === country)?.isoCode
                                  ).filter(Boolean) as string[]}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <select
                                  name="country"
                                  value={selectedCountry?.name || ''}
                                  onChange={(e) => {
                                    const country = availableCountries.find(c => c.name === e.target.value);
                                    if (country) {
                                      handleCountryChange(country);
                                    }
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  required
                                >
                                  <option value="">Select Country</option>
                                  {availableCountries.map(country => (
                                    <option key={country.isoCode} value={country.name}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                {availableCities.length > 0 ? (
                                  <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleSelectChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                  >
                                    <option value="">Select City</option>
                                    {availableCities.map(city => (
                                      <option key={city.name} value={city.name}>
                                        {city.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                  />
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                  type="text"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                                <input
                                  type="text"
                                  name="postcode"
                                  value={formData.postcode}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {errorMessage && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-md">
                              {errorMessage}
                            </div>
                          )}
                          
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-600 text-white py-3 rounded-md hover:bg-yellow-700 transition-colors duration-150 flex items-center justify-center text-lg font-medium disabled:opacity-50"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              `Proceed to Payment`
                            )}
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Complete Payment</h3>
                            <button 
                              type="button"
                              onClick={() => setShowPayment(false)}
                              className="text-sm text-yellow-600 hover:text-yellow-700"
                            >
                              &larr; Back to Details
                            </button>
                          </div>
                          
                          <div className="bg-yellow-50 p-4 rounded-md mb-6">
                            <h4 className="font-medium text-yellow-800 mb-2">Gift Card Summary</h4>
                            <p className="text-yellow-800">Amount: <span className="font-bold">£{formData.amount.toFixed(2)}</span></p>
                            <p className="text-yellow-800">Recipient: {formData.recipientName}</p>
                          </div>
                          
                          <StripePayment
                            amount={formData.amount}
                            currency="gbp"
                            description={`Gift Card for ${formData.recipientName}`}
                            metadata={{
                              recipientName: formData.recipientName,
                              recipientEmail: formData.recipientEmail,
                              buyerName: formData.buyerName,
                              buyerEmail: formData.buyerEmail
                            }}
                            customerEmail={formData.email || formData.buyerEmail}
                            customerCountry={formData.country}
                            paymentType="gift-card"
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}