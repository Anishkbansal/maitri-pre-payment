import React from 'react';
import { X, Loader2, Mail } from 'lucide-react';
import { CheckoutFormData } from '../types';
import PersonalInfoForm from './PersonalInfoForm';
import ShippingAddressForm from './ShippingAddressForm';
import PaymentInfoForm from './PaymentInfoForm';
import OrderSummary from './OrderSummary';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CheckoutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePhoneChange: (value: string) => void;
  quantity: number;
  isUKDelivery: boolean;
  availableCountries: any[];
  availableStates: any[];
  availableCities: any[];
  selectedCountry: any;
  selectedState: any;
  handleCountryChange: (country: any) => void;
  handleStateChange: (state: any) => void;
  onViewShippingRestrictions: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  sendingEmails: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSelectChange,
  handlePhoneChange,
  quantity,
  isUKDelivery,
  availableCountries,
  availableStates,
  availableCities,
  selectedCountry,
  selectedState,
  handleCountryChange,
  handleStateChange,
  onViewShippingRestrictions,
  onSubmit,
  isLoading,
  sendingEmails
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Checkout</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Personal Information */}
            <PersonalInfoForm 
              formData={formData}
              handleInputChange={handleInputChange}
              handlePhoneChange={handlePhoneChange}
            />

            {/* Shipping Address */}
            <ShippingAddressForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              availableCountries={availableCountries}
              availableStates={availableStates}
              availableCities={availableCities}
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              handleCountryChange={handleCountryChange}
              handleStateChange={handleStateChange}
              onViewShippingRestrictions={onViewShippingRestrictions}
            />

            {/* Payment Information */}
            <PaymentInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
            />

            {/* Order Summary */}
            <OrderSummary
              quantity={quantity}
              isUKDelivery={isUKDelivery}
            />

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
  );
};

export default CheckoutModal; 