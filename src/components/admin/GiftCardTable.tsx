import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { GiftCard, GiftCardStatus, GiftCardHistoryEntry } from './types';
import UpdateGiftCardModal from './UpdateGiftCardModal';

interface GiftCardTableProps {
  giftCards: GiftCard[];
  onUpdateSuccess: () => void;
}

const GiftCardTable: React.FC<GiftCardTableProps> = ({ giftCards, onUpdateSuccess }) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [updateModalCard, setUpdateModalCard] = useState<GiftCard | null>(null);

  const toggleExpand = (cardId: string) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  const handleUpdateClick = (card: GiftCard) => {
    setUpdateModalCard(card);
  };

  const handleCloseModal = () => {
    setUpdateModalCard(null);
  };

  const getStatusBadgeClass = (status: GiftCardStatus) => {
    switch (status) {
      case GiftCardStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case GiftCardStatus.EXPIRED:
        return 'bg-orange-100 text-orange-800';
      case GiftCardStatus.EXHAUSTED:
        return 'bg-gray-100 text-gray-800';
      case GiftCardStatus.CLOSED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      // Log the date string for debugging
      console.log(`Formatting date: ${dateString}`);
      
      // Try different date formats
      // First try with Date constructor
      let date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        // Try to parse MM/DD/YYYY format
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const month = parseInt(parts[0]) - 1;
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          date = new Date(year, month, day);
        }
      }
      
      // If still invalid, return the original string
      if (isNaN(date.getTime())) {
        console.log(`Invalid date: ${dateString}`);
        return dateString;
      }
      
      // Format the date consistently
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error);
      return dateString; // If parsing fails, return the original string
    }
  };

  // Helper to safely format currency values
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '£0.00';
    return `£${value.toFixed(2)}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {giftCards.map((card) => (
            <React.Fragment key={card.id}>
              <tr className={`hover:bg-gray-50 ${expandedCardId === card.id ? 'bg-gray-50' : ''}`}>
                <td className="px-4 py-4">
                  <button 
                    onClick={() => toggleExpand(card.id)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    {expandedCardId === card.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-4 font-mono text-sm">{card.code || 'N/A'}</td>
                <td className="px-4 py-4 text-sm">{card.recipientName || 'N/A'}</td>
                <td className="px-4 py-4 text-sm">
                  <div>
                    <span className="font-medium">{formatCurrency(card.balance)}</span>
                    {card.balance !== undefined && card.amount !== undefined && card.balance !== card.amount && (
                      <span className="text-gray-500 text-xs ml-1">
                        (Original: {formatCurrency(card.amount)})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm">{formatDate(card.createdAt)}</td>
                <td className="px-4 py-4 text-sm">{formatDate(card.expiresAt)}</td>
                <td className="px-4 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(card.status)}`}>
                    {card.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">
                  {card.status === GiftCardStatus.ACTIVE && (
                    <button
                      onClick={() => handleUpdateClick(card)}
                      className="p-1 rounded-full hover:bg-yellow-100 text-yellow-600"
                      title="Update Gift Card"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
              {expandedCardId === card.id && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 bg-gray-50">
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">Buyer Information</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Name:</span> {card.buyerName || 'N/A'}</p>
                            <p><span className="font-medium">Email:</span> {card.buyerEmail || 'N/A'}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">Recipient Information</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Name:</span> {card.recipientName || 'N/A'}</p>
                            <p><span className="font-medium">Email:</span> {card.recipientEmail || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {card.message && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">Message</h4>
                          <div className="text-sm bg-gray-50 p-3 rounded-md italic">
                            "{card.message}"
                          </div>
                        </div>
                      )}
                      
                      {/* For now, we'll just show basic gift card info since we don't have history in the updated interface */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Gift Card Details</h4>
                        <div className="bg-gray-50 rounded-md p-4 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <p><span className="font-medium">Created:</span> {formatDate(card.createdAt)}</p>
                            <p><span className="font-medium">Expires:</span> {formatDate(card.expiresAt)}</p>
                            <p><span className="font-medium">Original Amount:</span> {formatCurrency(card.amount)}</p>
                            <p><span className="font-medium">Current Balance:</span> {formatCurrency(card.balance)}</p>
                            <p><span className="font-medium">Status:</span> {card.status || 'Unknown'}</p>
                            {card.lastUsed && (
                              <p><span className="font-medium">Last Used:</span> {formatDate(card.lastUsed)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          
          {giftCards.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                No gift cards found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {updateModalCard && (
        <UpdateGiftCardModal 
          giftCard={updateModalCard}
          onClose={handleCloseModal}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </div>
  );
};

export default GiftCardTable; 