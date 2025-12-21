import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminAnalytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
        recentOrders: 0
    });

    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [offerRevenue, setOfferRevenue] = useState({ withOffers: [], withoutOffers: {} });

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, salesRes, productsRes, offersRes] = await Promise.all([
                api.get('/analytics/stats'),
                api.get('/analytics/sales?period=daily&days=30'),
                api.get('/analytics/top-products'),
                api.get('/analytics/offer-revenue')
            ]);

            console.log('Analytics Data:', {
                stats: statsRes.data,
                sales: salesRes.data,
                products: productsRes.data,
                offers: offersRes.data
            });

            setStats(statsRes.data);
            setSalesData(salesRes.data);
            setTopProducts(productsRes.data);
            setOfferRevenue(offersRes.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }
        fetchAnalytics();
    }, [user, navigate, fetchAnalytics]);

    if (loading) {
        return (
            <div className="min-h-screen py-8" >
                <div className="container mx-auto px-4">
                    <div className="text-center py-20">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-white">Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-white">📊 Analytics Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold text-primary-500">₹{stats.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-blue-500">{stats.totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Total Customers</p>
                                <p className="text-3xl font-bold text-purple-500">{stats.totalCustomers}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-sm mb-1">Avg Order Value</p>
                                <p className="text-3xl font-bold text-orange-500">₹{stats.avgOrderValue}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Products */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">🏆 Top Selling Products</h2>
                        {topProducts.length > 0 ? (
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-700 bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all">
                                        <div className="text-2xl font-bold text-primary-500 w-8">#{index + 1}</div>
                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white">{product.name}</h3>
                                            <p className="text-sm text-white">Sold: {product.totalQuantity} units</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary-500">₹{product.totalRevenue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white text-center py-8">No product data available</p>
                        )}
                    </div>

                    {/* Offer Revenue */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">🎁 Offer Revenue Breakdown</h2>
                        <div className="space-y-4">
                            {offerRevenue.withOffers.length > 0 ? (
                                <>
                                    {offerRevenue.withOffers.map((offer) => (
                                        <div key={offer._id} className="p-4 bg-gradient-to-r from-green-500 bg-opacity-10 to-transparent rounded-lg border border-green-500 border-opacity-30">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-white text-lg">{offer.offerCode}</h3>
                                                <span className="badge bg-green-500 text-white">{offer.orderCount} orders</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white">Total Discount:</span>
                                                <span className="text-red-400 font-semibold">-₹{offer.totalDiscount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white">Revenue:</span>
                                                <span className="text-primary-500 font-semibold">₹{offer.totalRevenue.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="p-4 bg-gray-700 bg-opacity-30 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-white">Without Offers</h3>
                                            <span className="badge bg-gray-500 text-white">{offerRevenue.withoutOffers.orderCount} orders</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white">Revenue:</span>
                                            <span className="text-primary-500 font-semibold">₹{offerRevenue.withoutOffers.totalRevenue?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-white text-center py-8">No offer data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
