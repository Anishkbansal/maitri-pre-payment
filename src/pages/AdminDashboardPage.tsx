import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Package, LogOut } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import { fetchGiftCards } from '../utils/api';
import { fetchProducts } from '../utils/api';
import { adminLogout } from '../utils/auth';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    activeGiftCards: 0,
    productsInStock: 0,
    pendingOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch gift cards
        const giftCardData = await fetchGiftCards();
        const activeGiftCards = giftCardData.giftCards?.filter(
          card => card.status === 'active'
        ).length || 0;

        // Fetch products and orders
        const productsData = await fetchProducts();
        
        // Calculate total stock
        const totalStock = productsData.products?.reduce(
          (sum, product) => sum + (product.stock || 0), 
          0
        ) || 0;
        
        // Count pending orders
        const pendingOrders = productsData.orders?.filter(
          order => order.status === 'pending'
        ).length || 0;

        setStats({
          activeGiftCards,
          productsInStock: totalStock,
          pendingOrders
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="container mx-auto">
      <AdminHeader title="Admin Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Gift Card Management Card */}
        <Link 
          to="/admin/gift-cards"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <CreditCard className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold ml-4">Gift Cards</h2>
          </div>
          <p className="text-gray-600">
            Manage gift cards, track balances, and view transaction history.
          </p>
        </Link>
        
        {/* Product Management Card */}
        <Link 
          to="/admin/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold ml-4">Products</h2>
          </div>
          <p className="text-gray-600">
            Manage product inventory, track orders, and update delivery status.
          </p>
        </Link>
        
        {/* Logout Card */}
        <button 
          onClick={handleLogout}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <LogOut className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold ml-4">Logout</h2>
          </div>
          <p className="text-gray-600">
            Sign out from your admin account.
          </p>
        </button>
      </div>
      
      {/* Stats Overview */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Active Gift Cards</h3>
            {isLoading ? (
              <div className="h-8 mt-2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold mt-2">{stats.activeGiftCards}</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Products In Stock</h3>
            {isLoading ? (
              <div className="h-8 mt-2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold mt-2">{stats.productsInStock}</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Pending Orders</h3>
            {isLoading ? (
              <div className="h-8 mt-2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 