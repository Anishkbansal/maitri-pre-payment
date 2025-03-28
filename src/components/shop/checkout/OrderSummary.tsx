import React from 'react';

interface OrderSummaryProps {
  quantity: number;
  price: number;
  shippingCost: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ quantity, price, shippingCost }) => {
  const totalPrice = price + shippingCost;
  
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Product ({quantity} {quantity === 1 ? 'unit' : 'units'})</span>
          <span>£{price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>£{totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 