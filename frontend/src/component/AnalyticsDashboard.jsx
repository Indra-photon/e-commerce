import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, PieChart, Pie, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Cell
} from 'recharts';
import { Wallet, Users, ShoppingBag, TrendingUp, CreditCard, TrendingDown, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

const AnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [stats, setStats] = useState({
        summary: {
            totalSales: 0,
            totalCustomers: 0,
            totalOrders: 0,
            avgOrderValue: 0,
            newCustomers: 0,
            paymentSuccessRate: 0
        },
        growth: {
            sales: 0,
            orders: 0,
            customers: 0
        },
        monthlyRevenue: [],
        customerDistribution: [],
        topProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://luxe-store.onrender.com/api/v1/users/dashboard-stats', {
                    withCredentials: true,
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch dashboard stats');
                }

                const data = await response.json();
                setStats(data.data);
            } catch (err) {
                setError(err.message);
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, [timeRange]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg">Loading dashboard data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-red-800">Error loading dashboard: {error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white"
                >
                    <option value="day">Last 24 Hours</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last Year</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Total Sales" 
                    value={`$${stats.summary.totalSales.toLocaleString()}`}
                    icon={<Wallet className="w-6 h-6" />}
                    trend={`${stats.growth.sales}%`}
                    trendUp={parseFloat(stats.growth.sales) >= 0}
                />
                <StatsCard 
                    title="Total Customers" 
                    value={stats.summary.totalCustomers.toLocaleString()}
                    icon={<Users className="w-6 h-6" />}
                    trend={`${stats.growth.customers}%`}
                    trendUp={parseFloat(stats.growth.customers) >= 0}
                />
                <StatsCard 
                    title="Total Orders" 
                    value={stats.summary.totalOrders.toLocaleString()}
                    icon={<ShoppingBag className="w-6 h-6" />}
                    trend={`${stats.growth.orders}%`}
                    trendUp={parseFloat(stats.growth.orders) >= 0}
                />
                <StatsCard 
                    title="Success Rate" 
                    value={`${stats.summary.paymentSuccessRate.toFixed(1)}%`}
                    icon={<CreditCard className="w-6 h-6" />}
                    trend="Payment Success"
                    trendUp={stats.summary.paymentSuccessRate >= 80}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                    <div className="h-80">
                        {stats.monthlyRevenue?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="_id"
                                        tickFormatter={(value) => {
                                            const date = new Date(value.year, value.month - 1);
                                            return date.toLocaleDateString('default', { month: 'short' });
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => `$${value.toLocaleString()}`}
                                        labelFormatter={(value) => {
                                            const date = new Date(value.year, value.month - 1);
                                            return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#8884d8" 
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No revenue data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Customer Distribution</h3>
                    <div className="h-80">
                        {stats.customerDistribution?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.customerDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="_id"
                                        label={({ _id, percent }) => 
                                            `${_id} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {stats.customerDistribution.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]} 
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No customer distribution data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity Sold
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.topProducts?.map((product, index) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.productName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {product.totalQuantity.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${product.totalRevenue.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, trend, trendUp }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h4 className="text-2xl font-semibold mt-2">{value}</h4>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
                {icon}
            </div>
        </div>
        <div className={`mt-4 text-sm flex items-center gap-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend}
        </div>
    </div>
);

export default AnalyticsDashboard;