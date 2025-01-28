import React, { useState } from 'react';
import { Layout, Menu, BarChart3, Users, ShoppingCart, Package, Bell } from 'lucide-react';
import { useEffect } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard'
import CustomerManagement from './CustomerManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement'

const BASE_URL = 'https://luxe-store.onrender.com/api/v1'; // Adjust based on your API URL

export const useCustomers = (page = 1, limit = 10, customerType = '', customerStatus = '') => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams({
                    page,
                    limit,
                    ...(customerType && { customerType }),
                    ...(customerStatus && { customerStatus })
                });

                const response = await fetch(`${BASE_URL}/users/customers?${queryParams}`, {
                    credentials: 'include' // For sending cookies
                });

                if (!response.ok) throw new Error('Failed to fetch customers');

                const data = await response.json();
                setCustomers(data.data.customers);
                setTotalPages(data.data.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [page, limit, customerType, customerStatus]);

    return { customers, loading, error, totalPages };
};

export const useCustomerAnalytics = (userId) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/users/customers/${userId}/analytics`, {
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Failed to fetch customer analytics');

                const data = await response.json();
                setAnalytics(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAnalytics();
        }
    }, [userId]);

    return { analytics, loading, error };
};

// Hook for updating customer status
export const useUpdateCustomerStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateStatus = async (userId, customerStatus, customerType) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/users/customers/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ customerStatus, customerType })
            });

            if (!response.ok) throw new Error('Failed to update customer status');

            const data = await response.json();
            return data.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateStatus, loading, error };
};

const AdminDashboard = () => {
    const [activeMenu, setActiveMenu] = useState('analytics');
  
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <nav className="mt-4">
            <div className="px-4 py-2">
              <button
                onClick={() => setActiveMenu('analytics')}
                className={`flex items-center w-full px-4 py-2 rounded-lg ${
                  activeMenu === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Analytics
              </button>
  
              <button
                onClick={() => setActiveMenu('customers')}
                className={`flex items-center w-full px-4 py-2 mt-2 rounded-lg ${
                  activeMenu === 'customers' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Customers
              </button>
  
              <button
                onClick={() => setActiveMenu('orders')}
                className={`flex items-center w-full px-4 py-2 mt-2 rounded-lg ${
                  activeMenu === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Orders
              </button>
  
              <button
                onClick={() => setActiveMenu('products')}
                className={`flex items-center w-full px-4 py-2 mt-2 rounded-lg ${
                  activeMenu === 'products' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                Products
              </button>
            </div>
          </nav>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
              </h2>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6" />
              </button>
            </div>
          </header>
  
          {/* Content Area */}
          <main className="p-6">
            {activeMenu === 'analytics' && <AnalyticsDashboard />}
            {activeMenu === 'customers' && <CustomerManagement />}
            {activeMenu === 'orders' && <OrderManagement />}
            {activeMenu === 'products' && <ProductManagement />}
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;