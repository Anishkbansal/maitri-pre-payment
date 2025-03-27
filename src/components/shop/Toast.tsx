import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ToastProps } from './types';

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:text-gray-200">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast; 