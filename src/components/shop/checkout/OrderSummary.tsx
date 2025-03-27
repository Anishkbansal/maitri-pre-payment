import React from 'react';
import { calculatePrice } from '../types';

interface OrderSummaryProps {
  quantity: number;
  isUKDelivery: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ quantity, isUKDelivery }) => {
  return (
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
  );
};

export default OrderSummary; 