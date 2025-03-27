import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CreditCard, Package, Home } from 'lucide-react';
import { adminLogout } from '../../utils/auth';

interface AdminDashboardProps {
  children: React.ReactNode;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="md:w-64 bg-gray-800 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Maitri Clinic</p>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
              >
                <Home className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/gift-cards" 
                className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
              >
                <CreditCard className="h-5 w-5 mr-3" />
                Gift Cards
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-700"
              >
                <Package className="h-5 w-5 mr-3" />
                Products
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-gray-300 rounded hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminDashboard; 