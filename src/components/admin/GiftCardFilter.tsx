import React from 'react';
import { Search } from 'lucide-react';
import { GiftCardFilterOptions, GiftCardStatus } from './types';

interface GiftCardFilterProps {
  filters: GiftCardFilterOptions;
  onFilterChange: (filters: GiftCardFilterOptions) => void;
}

const GiftCardFilter: React.FC<GiftCardFilterProps> = ({ filters, onFilterChange }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as GiftCardStatus | 'all';
    onFilterChange({ ...filters, status: value });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'all' | 'last30days' | 'last6months' | 'last12months';
    onFilterChange({ ...filters, dateRange: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status || 'all'}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="all">All Statuses</option>
            <option value={GiftCardStatus.ACTIVE}>Active</option>
            <option value={GiftCardStatus.EXPIRED}>Expired</option>
            <option value={GiftCardStatus.EXHAUSTED}>Exhausted</option>
            <option value={GiftCardStatus.CLOSED}>Closed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            id="dateRange"
            value={filters.dateRange || 'all'}
            onChange={handleDateRangeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="all">All Time</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last6months">Last 6 Months</option>
            <option value="last12months">Last 12 Months</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search by code, name, or email"
              value={filters.searchTerm || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardFilter; 