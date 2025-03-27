import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { calculatePrice } from './types';

interface PurchaseSectionProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onCheckout: () => void;
}

const PurchaseSection: React.FC<PurchaseSectionProps> = ({ 
  quantity, 
  onQuantityChange,
  onCheckout
}) => {
  return (
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
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            -
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button 
            onClick={() => onQuantityChange(quantity + 1)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            +
          </button>
        </div>
      </div>
      <button 
        onClick={onCheckout}
        className="w-full bg-yellow-600 text-white py-4 rounded-md hover:bg-yellow-700 transition-colors duration-150 flex items-center justify-center text-lg font-medium"
      >
        <ShoppingCart className="h-6 w-6 mr-2" />
        Proceed to Checkout
      </button>
    </div>
  );
};

export default PurchaseSection; 