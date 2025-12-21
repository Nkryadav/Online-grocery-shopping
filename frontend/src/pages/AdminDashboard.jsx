import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [products, orders] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders')
                ]);

                setStats({
                    totalProducts: products.data.products?.length || 0,
                    totalOrders: orders.data?.length || 0,
                    totalUsers: 0, // Would need a users endpoint
                    totalRevenue: orders.data?.reduce((sum, order) => sum + order.totalPrice, 0) || 0
                });

                // Get recent 5 orders
                setRecentOrders(orders.data?.slice(0, 5) || []);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen py-8" >
                <div className="container mx-auto px-4">
                    <p className="text-white text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-white">Welcome back, {user?.name}!</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6 hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Total Products</p>
                                <h3 className="text-3xl font-bold text-white">{stats.totalProducts}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Total Orders</p>
                                <h3 className="text-3xl font-bold text-white">{stats.totalOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-white">₹{stats.totalRevenue.toFixed(0)}</h3>
                            </div>
                            <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Active Offers</p>
                                <h3 className="text-3xl font-bold text-white">3</h3>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/admin/products" className="card p-6 hover-lift cursor-pointer group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Manage Products</h3>
                                <p className="text-white text-sm">Add, edit, or delete products</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/offers" className="card p-6 hover-lift cursor-pointer group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Manage Offers</h3>
                                <p className="text-white text-sm">Create and manage coupons</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/orders" className="card p-6 hover-lift cursor-pointer group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">View All Orders</h3>
                                <p className="text-white text-sm">Manage customer orders</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/analytics" className="card p-6 hover-lift cursor-pointer group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Analytics</h3>
                                <p className="text-white text-sm">View sales and statistics</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Orders Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-primary-400 hover:text-primary-300 font-medium">
                            View All →
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="card p-12 text-center">
                            <p className="text-white">No orders yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="card p-6 hover-lift">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-700">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-white">
                                                Customer: {order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})
                                            </p>
                                            <p className="text-xs text-white mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 mt-3 md:mt-0">
                                            <span className={`badge ${order.status === 'delivered' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                                                order.status === 'shipped' ? 'bg-purple-500 bg-opacity-20 text-purple-300' :
                                                    order.status === 'processing' ? 'bg-blue-500 bg-opacity-20 text-blue-300' :
                                                        'bg-yellow-500 bg-opacity-20 text-yellow-300'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            {order.isPaid ? (
                                                <span className="badge bg-green-500 bg-opacity-20 text-green-300">Paid</span>
                                            ) : (
                                                <span className="badge bg-yellow-500 bg-opacity-20 text-yellow-300">Pending</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-white mb-2">Order Items:</p>
                                            <div className="space-y-2">
                                                {order.orderItems.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm text-white">{item.name}</p>
                                                            <p className="text-xs text-white">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.orderItems.length > 3 && (
                                                    <p className="text-xs text-white">+{order.orderItems.length - 3} more items</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <p className="text-sm text-white">Shipping Address:</p>
                                                <p className="text-sm text-white">
                                                    {order.shippingAddress.address}, {order.shippingAddress.city}
                                                </p>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-sm text-white">Total Amount</p>
                                                <p className="text-2xl font-bold text-primary-500">
                                                    ₹{order.totalPrice.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <Link
                                            to={`/orders/${order._id}/track`}
                                            className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                                        >
                                            View Order Details →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
