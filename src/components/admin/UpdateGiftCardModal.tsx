import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GiftCard, GiftCardStatus, GiftCardUpdateFormData } from './types';
import { updateGiftCardAmount, closeGiftCard } from '../../utils/api';

interface UpdateGiftCardModalProps {
  giftCard: GiftCard;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const UpdateGiftCardModal: React.FC<UpdateGiftCardModalProps> = ({ 
  giftCard, 
  onClose,
  onUpdateSuccess 
}) => {
  // Use default value of 0 if balance is undefined
  const initialBalance = giftCard.balance ?? 0;
  
  const [formData, setFormData] = useState<GiftCardUpdateFormData>({
    amount: initialBalance,
    note: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateType, setUpdateType] = useState<'amount' | 'close'>('amount');
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Allow empty string (will be converted to 0) or valid number
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: 0 }));
        return;
      }
      
      const numValue = parseFloat(value);
      // Allow any value from 0 to the current balance
      if (isNaN(numValue) || numValue < 0 || numValue > (giftCard.balance ?? 0)) {
        return;
      }
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleUpdateTypeChange = (type: 'amount' | 'close') => {
    setUpdateType(type);
    
    // Reset the form data note
    setFormData(prev => ({ 
      ...prev, 
      note: '',
      // If changing to amount update, reset the amount to current
      amount: type === 'amount' ? (giftCard.balance ?? 0) : prev.amount
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    
    try {
      // Log what we're trying to update
      console.log('Updating gift card with ID:', giftCard.id);
      console.log('Current gift card data:', giftCard);
      console.log('Form data for update:', formData);
      
      if (updateType === 'amount') {
        // Validate amount (allow zero)
        if (formData.amount === undefined || formData.amount === null) {
          throw new Error('Amount is required');
        }
        
        if (formData.amount < 0) {
          throw new Error('Amount cannot be negative');
        }
        
        const currentBalance = giftCard.balance ?? 0;
        if (formData.amount > currentBalance) {
          throw new Error(`Amount cannot be more than the current balance (£${currentBalance.toFixed(2)})`);
        }
        
        // Show a confirmation dialog if setting to zero which will mark as exhausted
        if (formData.amount === 0 && !window.confirm('Setting the amount to zero will mark this gift card as exhausted. Continue?')) {
          setIsUpdating(false);
          return;
        }
        
        const response = await updateGiftCardAmount(giftCard.id, formData.amount, formData.note);
        console.log('Update response:', response);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to update gift card amount');
        }
        
        onUpdateSuccess();
        onClose();
      } else if (updateType === 'close') {
        // Validate note for closing
        if (!formData.note) {
          throw new Error('Please provide a reason for closing the gift card');
        }
        
        const response = await closeGiftCard(giftCard.id, formData.note);
        console.log('Close response:', response);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to close gift card');
        }
        
        onUpdateSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper function to safely format currency
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '£0.00';
    return `£${value.toFixed(2)}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Update Gift Card</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex flex-col space-y-2 bg-yellow-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Gift Card Code:</span>
                <span className="text-sm font-mono">{giftCard.code || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Recipient:</span>
                <span className="text-sm">{giftCard.recipientName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Current Balance:</span>
                <span className="text-sm font-medium">{formatCurrency(giftCard.balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className="text-sm">{giftCard.status || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="flex border-b mb-4">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  updateType === 'amount' 
                    ? 'text-yellow-600 border-b-2 border-yellow-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleUpdateTypeChange('amount')}
              >
                Update Amount
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  updateType === 'close' 
                    ? 'text-yellow-600 border-b-2 border-yellow-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleUpdateTypeChange('close')}
              >
                Close Gift Card
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {updateType === 'amount' && (
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  New Amount (£)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  max={giftCard.balance ?? 0}
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the new balance amount. This cannot exceed the current balance of {formatCurrency(giftCard.balance)}.
                  {formData.amount === 0 && (
                    <span className="block mt-1 text-red-500">
                      Note: Setting to zero will mark the gift card as exhausted.
                    </span>
                  )}
                </p>
              </div>
            )}
            
            {updateType === 'close' && (
              <div className="mb-4 bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 mb-2">
                  Closing a gift card will make it unusable, even if it has remaining balance. This action cannot be undone.
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                {updateType === 'amount' ? 'Note (Optional)' : 'Reason for Closing (Required)'}
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
                required={updateType === 'close'}
                placeholder={updateType === 'amount' 
                  ? 'Add a note about this update (e.g., "Customer redeemed £20 for massage service")'
                  : 'Provide a reason for closing this gift card'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  updateType === 'close'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                } disabled:opacity-50`}
              >
                {isUpdating 
                  ? 'Processing...' 
                  : updateType === 'amount' 
                    ? 'Update Amount' 
                    : 'Close Gift Card'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateGiftCardModal; 