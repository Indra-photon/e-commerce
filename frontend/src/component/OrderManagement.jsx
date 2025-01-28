// OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, RefreshCw } from 'lucide-react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('https://luxe-store.onrender.com/api/v1/payment/all-orders', {
                withCredentials: true
            });
            setOrders(data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            await axios.patch(`https://luxe-store.onrender.com/api/v1/payments/${orderId}/status`, { status });
            fetchOrders();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const OrderModal = ({ order, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Order Details</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Order ID</p>
                            <p className="text-sm">{order.razorpay_order_id}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Payment ID</p>
                            <p className="text-sm">{order.razorpay_payment_id}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Customer</p>
                            <p className="text-sm">{order.owner?.fullname}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status</p>
                            <p className="text-sm">{order.status}</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Products</p>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Product</th>
                                    <th className="text-right">Quantity</th>
                                    <th className="text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2">{item.productId.name}</td>
                                        <td className="text-right">{item.qty}</td>
                                        <td className="text-right">${item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Orders</h2>
                <button 
                    onClick={fetchOrders}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {order.razorpay_order_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {order.owner?.fullname}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.owner?.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="text-sm rounded-full px-3 py-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="successful">Successful</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <OrderModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default OrderManagement;