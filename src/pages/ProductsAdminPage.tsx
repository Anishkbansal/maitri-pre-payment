import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import AdminHeader from '../components/admin/AdminHeader';
import { fetchProducts, updateProductStock, updateOrderStatus } from '../utils/api';
import { Package, Truck, CheckCircle } from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  status: 'pending' | 'out_for_delivery' | 'completed';
  orderDate: string;
}

const ProductsAdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [stockEditing, setStockEditing] = useState<{[key: string]: boolean}>({});
  const [stockValues, setStockValues] = useState<{[key: string]: number}>({});

  // Load products and orders
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        console.log("Products data:", data);
        if (data.success) {
          setProducts(data.products || []);
          setOrders(data.orders || []);
          
          // Initialize stock values
          const stockMap: {[key: string]: number} = {};
          data.products?.forEach((product: Product) => {
            stockMap[product.id] = product.stock;
          });
          setStockValues(stockMap);
        } else {
          setError(data.message || 'Failed to load products');
        }
      } catch (err) {
        setError('An error occurred while loading data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle stock update
  const handleStockChange = (productId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setStockValues({
        ...stockValues,
        [productId]: numValue
      });
    }
  };

  const startEditingStock = (productId: string) => {
    setStockEditing({
      ...stockEditing,
      [productId]: true
    });
  };

  const saveStock = async (productId: string) => {
    try {
      const response = await updateProductStock(productId, stockValues[productId]);
      if (response.success) {
        setProducts(products.map(product => 
          product.id === productId 
            ? { ...product, stock: stockValues[productId] } 
            : product
        ));
        setStockEditing({
          ...stockEditing,
          [productId]: false
        });
      } else {
        setError('Failed to update stock: ' + response.message);
      }
    } catch (err) {
      setError('An error occurred while updating stock');
      console.error(err);
    }
  };

  // Handle order status update
  const updateStatus = async (orderId: string, status: 'pending' | 'out_for_delivery' | 'completed') => {
    try {
      const response = await updateOrderStatus(orderId, status);
      if (response.success) {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status } 
            : order
        ));
      } else {
        setError('Failed to update order status: ' + response.message);
      }
    } catch (err) {
      setError('An error occurred while updating order status');
      console.error(err);
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto">
      <AdminHeader title="Products Management" />
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mt-8"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="inventory" className="px-6">Inventory</TabsTrigger>
          <TabsTrigger value="orders" className="px-6">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-4">
          <div className="bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                            {product.imageUrl ? (
                              <img 
                                className="h-12 w-12 object-cover" 
                                src={product.imageUrl} 
                                alt={product.name} 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Product';
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 flex items-center justify-center bg-gray-200">
                                <Package className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">£{product.price?.toFixed(2) || '0.00'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stockEditing[product.id] ? (
                          <input
                            type="number"
                            min="0"
                            value={stockValues[product.id]}
                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{product.stock || 0}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stockEditing[product.id] ? (
                          <button
                            onClick={() => saveStock(product.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditingStock(product.id)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{order.id.substring(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.productName}</div>
                        <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">£{order.totalPrice?.toFixed(2) || '0.00'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {order.status === 'out_for_delivery' ? 'Out for Delivery' : 
                            order.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(order.id, 'out_for_delivery')}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Mark as Out for Delivery
                          </button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <button
                            onClick={() => updateStatus(order.id, 'completed')}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsAdminPage; 