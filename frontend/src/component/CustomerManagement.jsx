import React, { useState, useEffect } from 'react';
import axios from 'axios';


const CustomerManagement = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [customerType, setCustomerType] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const BASE_URL = 'https://luxe-store.onrender.com/api/v1';
 
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    page,
                    limit,
                    sort,
                    ...(customerType && { customerType })
                });
 
                const response = await axios.get(`${BASE_URL}/users/customers`, {
                    params,
                    withCredentials: true
                });
 
                setCustomers(response.data.data.customers);
                setTotalPages(response.data.data.totalPages);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching customers:', err);
            } finally {
                setLoading(false);
            }
        };
 
        fetchCustomers();
    }, [page, limit, customerType, sort]);
 
    const handleTypeChange = (e) => {
        setCustomerType(e.target.value);
        setPage(1);
    };
 
    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
 
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Customer List</h3>
                    <div className="flex gap-4">
                        <select 
                            className="px-4 py-2 border rounded-lg"
                            value={customerType}
                            onChange={handleTypeChange}
                        >
                            <option value="">All Types</option>
                            <option value="new">New</option>
                            <option value="regular">Regular</option>
                            <option value="vip">VIP</option>
                        </select>
                    </div>
                </div>
 
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Orders</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total Spent</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img 
                                                src={customer.avatar || '/default-avatar.png'} 
                                                alt="" 
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customer.fullname}</div>
                                                <div className="text-sm text-gray-500">{customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {customer.customerType}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            customer.customerStatus === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {customer.customerStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{customer.totalOrders}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">${customer.totalSpent}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <button className="text-blue-600 hover:text-blue-900">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
 
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 mt-4">
                    <select
                        className="px-3 py-1 border rounded-md"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
 
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 border rounded-md ${
                                    page === i + 1 ? 'bg-blue-600 text-white' : ''
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
 };
 
 export default CustomerManagement;