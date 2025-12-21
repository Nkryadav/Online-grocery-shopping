import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MyOrders = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/orders');
            return;
        }

        fetchOrders();
    }, [isAuthenticated, navigate]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders/list');
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        setOrderToDelete(orderId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/orders/${orderToDelete}`);
            setShowDeleteModal(false);
            setOrderToDelete(null);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete order');
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setOrderToDelete(null);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div
                className="min-h-screen py-8 relative"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Blur overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-0"></div>
                <div className="relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="text-center py-20">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="text-white">Loading your orders...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen py-8 relative"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Blur overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-0"></div>
                <div className="relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="text-center py-20">
                            <p className="text-red-500">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen py-8 relative"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-0"></div>
            <div className="relative z-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8 text-white">My Orders</h1>

                    {orders.length === 0 ? (
                        <div className="card p-12 text-center">
                            <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h2 className="text-2xl font-bold mb-2 text-white">No Orders Yet</h2>
                            <p className="text-white mb-6">You haven't placed any orders yet.</p>
                            <button
                                onClick={() => navigate('/products')}
                                className="btn-primary"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order._id} className="card p-6 hover-lift">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-700">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-white">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 mt-3 md:mt-0">
                                            <span className={`badge ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            {order.isPaid ? (
                                                <span className="badge badge-success">Paid</span>
                                            ) : (
                                                <span className="badge badge-warning">Pending Payment</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-white">{item.name}</h4>
                                                    <p className="text-sm text-white">
                                                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-white">
                                                        ₹{(item.quantity * item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-700">
                                        <div className="text-white text-sm mb-3 md:mb-0">
                                            <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                                            <p><strong>Shipping Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-white mb-1">Total Amount</p>
                                            <p className="text-2xl font-bold text-primary-500">
                                                ₹{order.totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {order.isDelivered && (
                                        <div className="mt-4 p-3 bg-green-900 bg-opacity-20 border border-green-700 rounded-lg">
                                            <p className="text-green-400 text-sm">
                                                ✓ Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() => navigate(`/orders/${order._id}/track`)}
                                            className="flex-1 bg-white hover:bg-gray-50 text-primary-600 font-semibold py-2 px-6 rounded-lg border-2 border-primary-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                                        >
                                            Track Order
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex-shrink-0 shadow-md hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full animate-slide-up shadow-2xl">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white text-center mb-2">Delete Order?</h3>
                                <p className="text-white text-center mb-6">
                                    Are you sure you want to delete this order? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={cancelDelete}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
