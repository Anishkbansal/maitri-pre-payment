import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CheckoutFormData } from '../types';

interface ShippingAddressFormProps {
  formData: CheckoutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  availableCountries: any[];
  availableStates: any[];
  availableCities: any[];
  selectedCountry: any;
  selectedState: any;
  handleCountryChange: (country: any) => void;
  handleStateChange: (state: any) => void;
  onViewShippingRestrictions: () => void;
  isUKDelivery: boolean;
  setIsUKDelivery: (isUK: boolean) => void;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  availableCountries,
  availableStates,
  availableCities,
  selectedCountry,
  selectedState,
  handleCountryChange,
  handleStateChange,
  onViewShippingRestrictions,
  isUKDelivery,
  setIsUKDelivery
}) => {
  // Automatically set UK delivery based on country
  useEffect(() => {
    if (selectedCountry) {
      setIsUKDelivery(selectedCountry.isoCode === 'GB');
    }
  }, [selectedCountry, setIsUKDelivery]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
      
      {/* UK Delivery Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 font-medium">
          {isUKDelivery 
            ? "Free UK Shipping" 
            : "International shipping costs an additional £16.00"}
        </p>
      </div>
      
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

        {selectedCountry && availableStates.length > 0 && (
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
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select State</option>
              {availableStates.map(state => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode / ZIP</label>
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

        {onViewShippingRestrictions && (
          <button
            type="button"
            onClick={onViewShippingRestrictions}
            className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center space-x-1"
          >
            <span>Shipping is not available in these places</span>
            <X className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressForm; 