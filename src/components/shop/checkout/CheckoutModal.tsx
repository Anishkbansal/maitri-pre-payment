import React from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import OrderSummary from './OrderSummary';
import PersonalInfoForm from './PersonalInfoForm';
import ShippingAddressForm from './ShippingAddressForm';
import { CheckoutFormData } from '../types';
import StripePayment from '../../payments/StripePayment';

interface CheckoutModalProps {
  quantity: number;
  price: number;
  formData: CheckoutFormData;
  isUKDelivery: boolean;
  setIsUKDelivery: (isUK: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePhoneChange: (value: string) => void;
  handleCountryChange: (country: any) => void;
  handleStateChange: (state: any) => void;
  countries: any[];
  availableStates: any[];
  selectedState: any;
  selectedCountry: any;
  availableCities: any[];
  isLoading: boolean;
  sendingEmails: boolean;
  showPayment: boolean;
  setShowPayment: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePaymentSuccess: (paymentIntentId: string) => Promise<void>;
  handlePaymentError: (error: Error) => void;
  handleCloseCheckout: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  quantity,
  price,
  formData,
  isUKDelivery,
  setIsUKDelivery,
  handleInputChange,
  handleSelectChange,
  handlePhoneChange,
  handleCountryChange,
  handleStateChange,
  countries,
  availableStates,
  selectedState,
  selectedCountry,
  availableCities,
  isLoading,
  sendingEmails,
  showPayment,
  setShowPayment,
  handleSubmit,
  handlePaymentSuccess,
  handlePaymentError,
  handleCloseCheckout
}) => {
  const totalPrice = price + (isUKDelivery ? 0 : 16);
  
  // Define a simple onViewShippingRestrictions function
  const onViewShippingRestrictions = () => {
    // Just log that restrictions were viewed
    console.log('Shipping restrictions viewed');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Checkout</h2>
            <button 
              onClick={handleCloseCheckout}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          {!showPayment ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <OrderSummary
                quantity={quantity}
                price={price}
                shippingCost={isUKDelivery ? 0 : 16}
              />
              
              <PersonalInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
                handlePhoneChange={handlePhoneChange}
              />
              
              <ShippingAddressForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleCountryChange={handleCountryChange}
                availableCountries={countries}
                selectedCountry={selectedCountry}
                availableCities={availableCities}
                isUKDelivery={isUKDelivery}
                setIsUKDelivery={setIsUKDelivery}
                handleSelectChange={handleSelectChange}
                availableStates={availableStates}
                selectedState={selectedState}
                handleStateChange={handleStateChange}
                onViewShippingRestrictions={onViewShippingRestrictions}
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-600 text-white py-4 rounded-md hover:bg-yellow-700 transition-colors duration-150 text-lg font-medium flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <OrderSummary
                quantity={quantity}
                price={price}
                shippingCost={isUKDelivery ? 0 : 16}
              />
              
              <StripePayment
                amount={totalPrice}
                currency="gbp"
                description={`${quantity} ${quantity === 1 ? 'capsule' : 'capsules'} of probiotic supplement`}
                metadata={{
                  quantity: quantity.toString(),
                  isUKDelivery: isUKDelivery ? 'true' : 'false'
                }}
                customerEmail={formData.email}
                customerCountry={formData.country}
                paymentType="product"
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
              
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors duration-150 text-base font-medium mt-4"
              >
                Back to Checkout Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal; 