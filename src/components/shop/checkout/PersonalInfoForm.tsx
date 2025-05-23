import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Country } from 'country-state-city';
import { CheckoutFormData, RESTRICTED_COUNTRIES } from '../types';

interface PersonalInfoFormProps {
  formData: CheckoutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange?: (value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleInputChange,
  handlePhoneChange
}) => {
  const onPhoneChange = (value: string) => {
    if (handlePhoneChange) {
      handlePhoneChange(value);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <PhoneInput
            country={'gb'}
            value={formData.phone}
            onChange={onPhoneChange}
            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md"
            containerClass="w-full"
            excludeCountries={RESTRICTED_COUNTRIES.map(country => 
              Country.getAllCountries().find(c => c.name === country)?.isoCode
            ).filter(Boolean) as string[]}
            inputProps={{
              required: true,
              name: 'phone'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm; 