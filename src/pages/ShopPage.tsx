import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, X, Loader2, Mail } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Country, State, City } from 'country-state-city';
import { sendOrderEmails } from '../utils/api';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  date: Date;
  time: string;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:text-gray-200">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

interface CountryData {
  name: {
    common: string;
    official: string;
  };
  callingCodes: string[];
  flag: string;
  cca2: string;
}

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  maxLength: number;
}

const RESTRICTED_COUNTRIES = [
  'Afghanistan', 'Azerbaijan', 'Armenia', 'Belarus', 'Myanmar', 'China',
  'Congo (DRC)', 'Egypt', 'Eritrea', 'Guinea', 'Guinea-Bissau', 'Haiti', 
  'Iran', 'Iraq', 'Côte d\'Ivoire', 'North Korea', 'Lebanon', 'Liberia', 
  'Libya', 'Russia', 'Sierra Leone', 'Somalia', 'South Sudan', 'Sudan', 
  'Syria', 'Tunisia', 'Ukraine', 'Zimbabwe', 'Pakistan', 'Bangladesh'
];

interface ShippingRestrictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShippingRestrictionsModal: React.FC<ShippingRestrictionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Shipping Restrictions</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="prose prose-lg">
            <p className="text-gray-700 mb-4">
              We currently do not ship to the following countries due to various restrictions and regulations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESTRICTED_COUNTRIES.map((country, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="text-gray-700">{country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ShopPage() {
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

  const basePrice = 350;
  const calculatePrice = (qty: number) => {
    if (qty === 1) return basePrice;
    if (qty === 2) return basePrice + (basePrice * 0.9);
    return basePrice + (basePrice * 0.9) + (basePrice * (qty - 2));
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

    if (name === 'city') {
      // City selection logic if needed
    }
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
        cvv: ''
      } as CheckoutFormData);
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
          <div>
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Chakra Model Harmonizer</h2>
              <p className="text-lg text-gray-700 mb-6">
                Advanced Protection Technology with Scalar Wave Frequencies
              </p>
              <div className="prose prose-lg text-gray-700 mb-6">
                <p>
                  Placing a Harmonix Resonator in a room generates a healing scalar field, creating an environment that supports deep relaxation and restoration. By tuning the surrounding frequency to 7.83Hz—the Schumann Resonance, which aligns with human biology—it helps correct brain and body imbalances naturally.
                </p>
                <p className="mt-4">
                  However, for 7.83Hz to benefit the body, it must exist within a zero-point electromagnetic field (scalar energy field). Harmonix Scalar Generators achieve this using a researched and tested scalar antenna along with our proprietary DNA-shaped coil antenna infused with chakra frequencies.
                </p>
                <p className="mt-4">
                  This emitted scalar energy produces a zero-point energy field of unlimited potential, neutralizing disruptive environmental frequencies. By eliminating these chaotic signals, the body's cells can function optimally, leveraging their innate intelligence for self-healing and overall well-being.
                </p>
              </div>
              <img
                src="https://i.postimg.cc/CLz1kf3C/20250321-171231.jpg"
                alt="Chakra Model Harmonizer"
                className="rounded-lg shadow-lg w-full"
              />
            </div>

            {/* Perfect for Those Who */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold mb-6">Perfect for Those Who:</h3>
              <ul className="space-y-3">
                {symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Frequencies & Purchase */}
          <div>
            {/* Frequencies */}
            <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold mb-6">Chakra Model Frequencies</h3>
              <div className="grid gap-4">
                {frequencies.map((freq, index) => (
                  <div key={index} className="flex items-center">
                    <span className="font-medium text-yellow-600 w-24">{freq.hz}</span>
                    <span className="text-gray-700">{freq.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <pre className="text-3xl font-bold text-navy-900">
                    £{calculatePrice(quantity).toFixed(2)}
                  </pre>
                  <p className="text-gray-400 text-sm mt-1">£16 for international shipping</p>
                  {quantity === 2 && (
                    <p className="text-gray-500 text-sm mt-1">
                      Second item at 10% discount
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 border border-gray-300 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-yellow-600 text-white py-4 rounded-md hover:bg-yellow-700 transition-colors duration-150 flex items-center justify-center text-lg font-medium"
              >
                <ShoppingCart className="h-6 w-6 mr-2" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-900">Checkout</h2>
                <button 
                  onClick={handleCloseCheckout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                        value={formData.email}
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
                  <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        name="country"
                        value={selectedCountry?.isoCode || ''}
                        onChange={(e) => {
                          const country = availableCountries.find(c => c.isoCode === e.target.value);
                          if (country) {
                            handleCountryChange(country);
                          }
                        }}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Country</option>
                        {availableCountries.map(country => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCountry && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                          <select
                            name="state"
                            value={selectedState?.isoCode || ''}
                            onChange={(e) => {
                              const state = availableStates.find(s => s.isoCode === e.target.value);
                              if (state) {
                                handleStateChange(state);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select State</option>
                            {availableStates.map(state => (
                              <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
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
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Enter city name"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowShippingRestrictions(true)}
                      className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center space-x-1"
                    >
                      <span>Shipping is not available in these places</span>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                          maxLength={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>£{calculatePrice(quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{isUKDelivery ? '£0.00 (Free)' : '£16.00'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>£{(calculatePrice(quantity) + (isUKDelivery ? 0 : 16)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || sendingEmails}
                  className="w-full bg-yellow-600 text-white py-4 rounded-md hover:bg-yellow-700 transition-colors duration-150 text-lg font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : sendingEmails ? (
                    <>
                      <Mail className="h-5 w-5 mr-2" />
                      Sending Order Confirmation...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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