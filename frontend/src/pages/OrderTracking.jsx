import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    const getStatusSteps = () => {
        const steps = [
            { name: 'Order Placed', status: 'pending', icon: '📦' },
            { name: 'Processing', status: 'processing', icon: '⚙️' },
            { name: 'Shipped', status: 'shipped', icon: '🚚' },
            { name: 'Delivered', status: 'delivered', icon: '✅' }
        ];

        const currentIndex = steps.findIndex(step => step.status === order?.status);

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8" >
                <div className="container mx-auto px-4">
                    <p className="text-white text-center">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen py-8" >
                <div className="container mx-auto px-4">
                    <div className="card p-6 text-center">
                        <p className="text-red-400 mb-4">{error || 'Order not found'}</p>
                        <button onClick={() => navigate('/orders')} className="btn-primary">
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusSteps = getStatusSteps();

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate('/orders')}
                    className="mb-6 text-primary-400 hover:text-primary-300 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </button>

                <h1 className="text-4xl font-bold mb-2 text-white">Track Order</h1>
                <p className="text-white mb-8">Order ID: #{order._id.slice(-8).toUpperCase()}</p>

                {/* Order Status Timeline */}
                <div className="card p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-8 text-white">Order Status</h2>

                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700">
                            <div
                                className="h-full bg-gradient-primary transition-all duration-500"
                                style={{
                                    width: `${(statusSteps.filter(s => s.completed).length - 1) / (statusSteps.length - 1) * 100}%`
                                }}
                            />
                        </div>

                        {/* Status Steps */}
                        <div className="relative grid grid-cols-4 gap-4">
                            {statusSteps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 transition-all duration-300 ${step.completed
                                                ? 'bg-gradient-primary text-white shadow-lg scale-110'
                                                : 'bg-gray-700 text-white'
                                            } ${step.active ? 'ring-4 ring-primary-500 ring-opacity-50 animate-pulse' : ''}`}
                                    >
                                        {step.icon}
                                    </div>
                                    <p className={`text-sm font-medium text-center ${step.completed ? 'text-white' : 'text-white'
                                        }`}>
                                        {step.name}
                                    </p>
                                    {step.completed && (
                                        <p className="text-xs text-white mt-1">
                                            {step.status === 'pending' && order.createdAt &&
                                                new Date(order.createdAt).toLocaleDateString()}
                                            {step.status === 'delivered' && order.deliveredAt &&
                                                new Date(order.deliveredAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Items */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-4 text-white">Order Items</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-700 last:border-b-0">
                                    <img
                                        src={item.image || 'https://via.placeholder.com/80'}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{item.name}</h3>
                                        <p className="text-white text-sm">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-4 text-white">Shipping Address</h2>
                            <div className="text-white">
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-4 text-white">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-white">
                                    <span>Subtotal</span>
                                    <span>₹{order.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white">
                                    <span>Tax</span>
                                    <span>₹{order.taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white">
                                    <span>Shipping</span>
                                    <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount</span>
                                        <span>-₹{order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-700 pt-2 mt-2">
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span>₹{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-white">Payment Method</span>
                                    <span className="text-white font-semibold capitalize">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-white">Payment Status</span>
                                    <span className={`font-semibold ${order.isPaid ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {order.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
