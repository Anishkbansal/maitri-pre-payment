import React, { useState } from 'react';
import { setupEmailConfig } from '../utils/api';

interface EmailSetupProps {
  onSetupComplete: () => void;
}

export default function EmailSetup({ onSetupComplete }: EmailSetupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminEmails, setAdminEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Split and trim admin emails
      const admins = adminEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      if (admins.length === 0) {
        setError('Please provide at least one admin email address');
        setIsLoading(false);
        return;
      }

      const response = await setupEmailConfig(email, password, admins);
      
      if (response.success) {
        setSuccess('Email configuration set up successfully!');
        setTimeout(() => {
          onSetupComplete();
        }, 2000);
      } else {
        setError(response.message || 'Failed to set up email configuration');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error setting up email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Email Configuration</h2>
          
          <p className="text-gray-600 mb-6">
            Please set up the email account that will be used to send order confirmations to customers and notifications to admins.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter sender email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter app password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                For Gmail, you need to create an app password in your Google Account security settings.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email Addresses</label>
              <textarea
                value={adminEmails}
                onChange={(e) => setAdminEmails(e.target.value)}
                required
                placeholder="Enter admin email addresses (comma-separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter comma-separated email addresses of administrators who should receive order notifications.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-600 text-white py-3 rounded-md hover:bg-yellow-700 transition-colors duration-150 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? 'Setting Up...' : 'Set Up Email Configuration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 