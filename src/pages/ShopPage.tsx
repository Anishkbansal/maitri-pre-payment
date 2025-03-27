import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { sendOrderEmails } from '../utils/api';

// Import shop components
import Toast from '../components/shop/Toast';
import ShippingRestrictionsModal from '../components/shop/ShippingRestrictionsModal';
import ProductDetails from '../components/shop/ProductDetails';
import FrequenciesInfo from '../components/shop/FrequenciesInfo';
import PurchaseSection from '../components/shop/PurchaseSection';
import CheckoutModal from '../components/shop/checkout/CheckoutModal';

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

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalPrice = calculatePrice(quantity) + (isUKDelivery ? 0 : 16);
      
      // Payment successful, now send emails
      setSendingEmails(true);
      
      try {
        await sendOrderEmails({
          formData,
          quantity,
          totalPrice,
          isUKDelivery
        });
        
        setToast({
          message: 'Payment successful! Order confirmation email sent.',
          type: 'success'
        });
      } catch (emailError) {
        console.error('Failed to send order emails:', emailError);
        setToast({
          message: 'Payment successful, but failed to send confirmation email.',
          type: 'info'
        });
      } finally {
        setSendingEmails(false);
      }
      
      // Here we would typically handle the payment processing
      console.log('Order details:', {
        quantity,
        totalPrice,
        customerDetails: formData
      });
      
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
    } catch (error) {
      setToast({
        message: 'Payment failed. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Harmonizer</h1>
          <p className="text-xl text-gray-600">
            Our Products generate Powerful Scalar Frequency Waves that produce specific therapeutic and healing effects on the body.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image & Details */}
          <ProductDetails symptoms={symptoms} />

          {/* Frequencies & Purchase */}
          <div>
            {/* Frequencies */}
            <FrequenciesInfo frequencies={frequencies} />

            {/* Purchase Section */}
            <PurchaseSection
              quantity={quantity}
              onQuantityChange={setQuantity}
              onCheckout={() => setShowCheckout(true)}
            />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={handleCloseCheckout}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handlePhoneChange={handlePhoneChange}
        quantity={quantity}
        isUKDelivery={isUKDelivery}
        availableCountries={availableCountries}
        availableStates={availableStates}
        availableCities={availableCities}
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        handleCountryChange={handleCountryChange}
        handleStateChange={handleStateChange}
        onViewShippingRestrictions={() => setShowShippingRestrictions(true)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        sendingEmails={sendingEmails}
      />

      {/* Shipping Restrictions Modal */}
      <ShippingRestrictionsModal
        isOpen={showShippingRestrictions}
        onClose={() => setShowShippingRestrictions(false)}
      />

      {/* Toast */}
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