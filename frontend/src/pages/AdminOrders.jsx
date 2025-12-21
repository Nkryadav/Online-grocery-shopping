import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            // Refresh orders
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await api.delete(`/orders/${orderId}`);
                // Refresh orders
                fetchOrders();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete order');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-600 text-white border-yellow-600',
            processing: 'bg-blue-600 text-white border-blue-600',
            shipped: 'bg-purple-600 text-white border-purple-600',
            delivered: 'bg-green-600 text-white border-green-600',
            cancelled: 'bg-red-600 text-white border-red-600',
        };
        return colors[status] || 'bg-gray-600 text-white border-gray-600';
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen py-8" >
                <div className="container mx-auto px-4">
                    <p className="text-white text-center">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Order Management</h1>
                    <p className="text-white">Manage all customer orders</p>
                </div>

                {/* Filters */}
                <div className="card p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Search Orders</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by Order ID, customer name or email..."
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Filter by Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input-field"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: '500'
                                }}
                            >
                                <option value="all" style={{ background: '#1e293b', color: 'white' }}>All Orders</option>
                                <option value="pending" style={{ background: '#1e293b', color: 'white' }}>Pending</option>
                                <option value="processing" style={{ background: '#1e293b', color: 'white' }}>Processing</option>
                                <option value="shipped" style={{ background: '#1e293b', color: 'white' }}>Shipped</option>
                                <option value="delivered" style={{ background: '#1e293b', color: 'white' }}>Delivered</option>
                                <option value="cancelled" style={{ background: '#1e293b', color: 'white' }}>Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6">
                        <p className="text-white text-sm mb-1">Total Orders</p>
                        <h3 className="text-3xl font-bold text-white">{orders.length}</h3>
                    </div>
                    <div className="card p-6">
                        <p className="text-white text-sm mb-1">Pending</p>
                        <h3 className="text-3xl font-bold text-yellow-400">
                            {orders.filter(o => o.status === 'pending').length}
                        </h3>
                    </div>
                    <div className="card p-6">
                        <p className="text-white text-sm mb-1">Processing</p>
                        <h3 className="text-3xl font-bold text-blue-400">
                            {orders.filter(o => o.status === 'processing').length}
                        </h3>
                    </div>
                    <div className="card p-6">
                        <p className="text-white text-sm mb-1">Delivered</p>
                        <h3 className="text-3xl font-bold text-green-400">
                            {orders.filter(o => o.status === 'delivered').length}
                        </h3>
                    </div>
                </div>

                {/* Orders Table */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="card p-12 text-center">
                        <p className="text-white">No orders found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="card p-6 hover-lift">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                    {/* Order Info */}
                                    <div className="lg:col-span-3">
                                        <p className="text-xs text-white mb-1">Order ID</p>
                                        <p className="font-semibold text-white">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-white mt-2">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {/* Customer */}
                                    <div className="lg:col-span-3">
                                        <p className="text-xs text-white mb-1">Customer</p>
                                        <p className="font-semibold text-white">{order.user?.name || 'N/A'}</p>
                                        <p className="text-xs text-white">{order.user?.email || 'N/A'}</p>
                                    </div>

                                    {/* Items */}
                                    <div className="lg:col-span-2">
                                        <p className="text-xs text-white mb-1">Items</p>
                                        <p className="font-semibold text-white">{order.orderItems.length} items</p>
                                        <p className="text-xs text-white">₹{order.totalPrice.toFixed(2)}</p>
                                    </div>

                                    {/* Payment */}
                                    <div className="lg:col-span-2">
                                        <p className="text-xs text-white mb-1">Payment</p>
                                        <p className="font-semibold text-white capitalize">{order.paymentMethod}</p>
                                        <span className={`text-xs px-2 py-1 rounded ${order.isPaid
                                            ? 'bg-green-500 bg-opacity-20 text-green-300'
                                            : 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                                            }`}>
                                            {order.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="lg:col-span-2">
                                        <p className="text-xs text-white mb-1">Status</p>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className={`w-full px-3 py-1 rounded border text-sm font-semibold ${getStatusColor(order.status)}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={() => navigate(`/orders/${order._id}/track`)}
                                            className="text-xs text-primary-400 hover:text-primary-300 mt-2 block"
                                        >
                                            View Details →
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order._id)}
                                            className="text-xs text-red-400 hover:text-red-300 mt-1 block"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
