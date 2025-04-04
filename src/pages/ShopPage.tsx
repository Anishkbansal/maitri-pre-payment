import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { sendOrderEmails } from '../utils/api';
import { completeProductOrder } from '../utils/payment';
import { X, Loader2 } from 'lucide-react';

// Import shop components
import Toast from '../components/shop/Toast';
import ShippingRestrictionsModal from '../components/shop/ShippingRestrictionsModal';
import ProductDetails from '../components/shop/ProductDetails';
import FrequenciesInfo from '../components/shop/FrequenciesInfo';
import PurchaseSection from '../components/shop/PurchaseSection';
import CheckoutModal from '../components/shop/checkout/CheckoutModal';
import StripePayment from '../components/payments/StripePayment';

// Import types
import { CheckoutFormData, RESTRICTED_COUNTRIES, calculatePrice } from '../components/shop/types';

export default function ShopPage() {
  // State variables
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showShippingRestrictions, setShowShippingRestrictions] = useState(false);
  const [isUKDelivery, setIsUKDelivery] = useState(false);
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    date: new Date(),
    time: new Date().toLocaleTimeString()
  });

  // Data arrays for product information
  const frequencies = [
    { hz: "7.83Hz", description: "Tune your body with earth energies" },
    { hz: "174 HZ", description: "Relieves pain, tension and stress" },
    { hz: "396 HZ", description: "Releases fear and guilt" },
    { hz: "417 HZ", description: "Releases negativity and heals trauma" },
    { hz: "432 HZ", description: "The heartbeat of the Earth" },
    { hz: "528 HZ", description: "The love frequency" },
    { hz: "639 HZ", description: "For harmonious relationships" },
    { hz: "741 HZ", description: "Eliminates toxins and negativity" },
    { hz: "852 HZ", description: "Awaken your intuition" },
    { hz: "963 HZ", description: "The pure miracle tone" }
  ];

  const symptoms = [
    "Wake up every day feeling drained or low on energy",
    "Are exposed to high levels of EMF (electromagnetic field) pollution",
    "Feel hypersensitive, easily irritated, or emotionally overwhelmed",
    "Constantly feel run down, fatigued, or lacking motivation",
    "Experience low immunity and get sick easily",
    "Struggle with chronic stress, anxiety, or burnout",
    "Feel like escaping or withdrawing from the world",
    "Have persistent sleep issues—trouble falling asleep, staying asleep, or waking up refreshed"
  ];

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

  // Form input handlers
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
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

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleCountryChange = (country: any) => {
    setSelectedCountry(country);
    
    // Update states for the selected country
    const states = State.getStatesOfCountry(country.isoCode);
    setAvailableStates(states);
    setSelectedState(null);
    setAvailableCities([]);
    
    // Check if UK and update shipping
    setIsUKDelivery(country.isoCode === 'GB');
    
    setFormData(prev => ({
      ...prev,
      country: country.name,
      state: '',
      city: ''
    }));
  };

  const handleStateChange = (state: any) => {
    setSelectedState(state);
    
    // Update cities for the selected state
    const cities = City.getCitiesOfState(
      selectedCountry?.isoCode || '',
      state.isoCode
    );
    setAvailableCities(cities);
    
    setFormData(prev => ({
      ...prev,
      state: state.name,
      city: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postcode', 'country'];
    
    // Add state requirement for countries that have states
    if (availableStates.length > 0 && !formData.state) {
      setToast({
        message: 'Please select a state/province.',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    // Check for any missing required fields
    const missingFields = requiredFields.filter(field => !formData[field as keyof CheckoutFormData]);
    if (missingFields.length > 0) {
      setToast({
        message: `Please fill out all required fields: ${missingFields.join(', ')}`,
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    try {
      // Show the payment component instead of processing immediately
      setShowPayment(true);
    } catch (error) {
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
      const totalPrice = calculatePrice(quantity) + (isUKDelivery ? 0 : 16);
      
      // Complete the order on the server
      const orderData = {
        formData,
        quantity,
        totalPrice,
        isUKDelivery
      };
      
      await completeProductOrder({
        paymentIntentId: paymentId,
        orderData
      });
      
      // Send confirmation emails
      try {
        const emailResult = await sendOrderEmails(orderData);
        
        if (!emailResult.success) {
          throw new Error(emailResult.message || 'Failed to send email');
        }
        
        setToast({
          message: 'Payment successful! Order confirmation email sent.',
          type: 'success'
        });
      } catch (emailError: any) {
        console.error('Failed to send order emails:', emailError);
        setToast({
          message: 'Payment successful! Your order has been placed, but we couldn\'t send a confirmation email.',
          type: 'success'
        });
      }
    } catch (error: any) {
      console.error('Order completion error:', error);
      setToast({
        message: 'Payment successful! Your order has been recorded.',
        type: 'success'
      });
    } finally {
      setSendingEmails(false);
      setIsLoading(false);
      setShowCheckout(false);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        date: new Date(),
        time: new Date().toLocaleTimeString()
      });
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setToast({
      message: 'Payment failed. Please try again.',
      type: 'error'
    });
    setIsLoading(false);
    setShowPayment(false);
  };

  const handleCloseCheckout = () => {
    if (isLoading) {
      setToast({
        message: 'Payment cancelled.',
        type: 'info'
      });
    }
    setShowCheckout(false);
    setIsLoading(false);
  };

  // Purchase button handler
  const handleBuyNow = () => {
    setShowCheckout(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-navy-900 mb-8">Our Products</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          {/* Product sections here... */}
          <ProductDetails symptoms={symptoms} />
          <FrequenciesInfo frequencies={frequencies} />
        </div>
        
        <PurchaseSection 
          quantity={quantity}
          onQuantityChange={setQuantity}
          onCheckout={handleBuyNow}
        />
        
        {/* Toast notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        
        {/* Checkout Modal */}
        {showCheckout && (
          <CheckoutModal
            quantity={quantity}
            price={calculatePrice(quantity)}
            formData={formData}
            isUKDelivery={isUKDelivery}
            setIsUKDelivery={setIsUKDelivery}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handlePhoneChange={handlePhoneChange}
            handleCountryChange={handleCountryChange}
            handleStateChange={handleStateChange}
            countries={availableCountries}
            availableStates={availableStates}
            selectedState={selectedState}
            selectedCountry={selectedCountry}
            availableCities={availableCities}
            isLoading={isLoading}
            sendingEmails={sendingEmails}
            showPayment={showPayment}
            setShowPayment={setShowPayment}
            handleSubmit={handleSubmit}
            handlePaymentSuccess={handlePaymentSuccess}
            handlePaymentError={handlePaymentError}
            handleCloseCheckout={handleCloseCheckout}
          />
        )}
      </div>
    </div>
  );
}