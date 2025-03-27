import React from 'react';
import { X } from 'lucide-react';
import { ShippingRestrictionsModalProps, RESTRICTED_COUNTRIES } from './types';

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

export default ShippingRestrictionsModal; 