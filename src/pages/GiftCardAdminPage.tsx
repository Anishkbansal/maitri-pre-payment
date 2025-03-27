import React, { useEffect, useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import GiftCardFilter from '../components/admin/GiftCardFilter';
import GiftCardTable from '../components/admin/GiftCardTable';
import { GiftCard, GiftCardFilterOptions } from '../components/admin/types';
import { fetchGiftCards } from '../utils/api';

const GiftCardAdminPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GiftCardFilterOptions>({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    loadGiftCards();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [giftCards, filters]);

  const loadGiftCards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchGiftCards();
      if (response?.success) {
        // Ensure we always have an array of gift cards
        const cards = Array.isArray(response.giftCards) ? response.giftCards : [];
        setGiftCards(cards);
      } else {
        setError(response?.message || 'Failed to load gift cards');
        // Initialize with empty array to avoid errors
        setGiftCards([]);
      }
    } catch (err) {
      console.error('Error loading gift cards:', err);
      setError('An error occurred while loading gift cards. Please try again later.');
      // Initialize with empty array to avoid errors
      setGiftCards([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // If there are no gift cards, set filtered cards to empty array
    if (!giftCards || giftCards.length === 0) {
      setFilteredCards([]);
      return;
    }
    
    let filtered = [...giftCards];
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(card => card.status === filters.status);
    }
    
    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'last30days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'last6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case 'last12months':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(card => {
        // Check if createdAt exists and is a valid date
        if (!card.createdAt) return false;
        try {
          const cardDate = new Date(card.createdAt);
          return cardDate >= cutoffDate;
        } catch (err) {
          return false;
        }
      });
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(card => 
        (card.code?.toLowerCase().includes(searchTerm) || false) ||
        (card.buyerName?.toLowerCase().includes(searchTerm) || false) ||
        (card.buyerEmail?.toLowerCase().includes(searchTerm) || false) ||
        (card.recipientName?.toLowerCase().includes(searchTerm) || false) ||
        (card.recipientEmail?.toLowerCase().includes(searchTerm) || false)
      );
    }
    
    setFilteredCards(filtered);
  };

  const handleFilterChange = (newFilters: GiftCardFilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Gift Card Management" />
      
      <div className="flex justify-end mb-6">
        <button 
          onClick={loadGiftCards}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      <GiftCardFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <p className="text-sm mt-1">Try refreshing the page or contact technical support if the problem persists.</p>
        </div>
      )}
      
      {!loading && !error && giftCards.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
          <p>No gift cards found in the system.</p>
          <p className="text-sm mt-1">Gift cards will appear here once customers purchase them.</p>
        </div>
      )}
      
      <GiftCardTable 
        giftCards={filteredCards}
        onUpdateSuccess={loadGiftCards}
      />
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default GiftCardAdminPage; 