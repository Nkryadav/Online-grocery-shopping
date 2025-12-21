import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import OfferBanner from '../components/OfferBanner';

const Offers = () => {
    const { user } = useAuth();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const { data } = await api.get('/offers');
            setOffers(data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeOffers = offers.filter(offer => {
        const now = new Date();
        const expiry = new Date(offer.validUntil);
        return offer.isActive && expiry > now;
    });

    const expiringSoon = activeOffers.filter(offer => {
        const daysLeft = Math.ceil((new Date(offer.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 2;
    });

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
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4 text-gradient">
                            🎉 Special Offers & Deals
                        </h1>
                        <p className="text-xl text-white">
                            Save big with our exclusive offers and discounts
                        </p>
                        {user?.isAdmin && (
                            <div className="mt-6">
                                <Link to="/admin/offers" className="btn-primary">
                                    Manage Offers
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    {!loading && activeOffers.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="card p-6 text-center">
                                <div className="text-4xl mb-2">🎯</div>
                                <div className="text-3xl font-bold text-primary-600">{activeOffers.length}</div>
                                <div className="text-white">Active Offers</div>
                            </div>
                            <div className="card p-6 text-center">
                                <div className="text-4xl mb-2">⏰</div>
                                <div className="text-3xl font-bold text-orange-500">{expiringSoon.length}</div>
                                <div className="text-white">Expiring Soon</div>
                            </div>
                            <div className="card p-6 text-center">
                                <div className="text-4xl mb-2">💰</div>
                                <div className="text-3xl font-bold text-green-500">Up to 30%</div>
                                <div className="text-white">Max Savings</div>
                            </div>
                        </div>
                    )}

                    {/* Offers Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="card h-64">
                                    <div className="skeleton h-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : activeOffers.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No active offers</h3>
                            <p className="text-white">Check back soon for amazing deals!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeOffers.map((offer) => (
                                <OfferBanner key={offer._id} offer={offer} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Offers;