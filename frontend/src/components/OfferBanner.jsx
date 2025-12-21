import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OfferBanner = ({ offer }) => {
    const [copied, setCopied] = useState(false);

    const getOfferText = () => {
        if (offer.offerType === 'percentage') {
            return `${offer.discountValue}% OFF`;
        } else if (offer.offerType === 'flat') {
            return `₹${offer.discountValue} OFF`;
        } else if (offer.offerType === 'bogo') {
            return 'BUY 1 GET 1';
        }
        return 'SPECIAL OFFER';
    };

    const isExpiringSoon = () => {
        const daysLeft = Math.ceil((new Date(offer.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 3;
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(offer.code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="card text-white overflow-hidden relative" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.5) 0%, rgba(22, 163, 74, 0.5) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
        }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            <div className="relative p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {/* Offer Badge */}
                        <div className="inline-block bg-white bg-opacity-20 text-white px-3 py-1.5 rounded-full font-bold text-lg mb-2 shadow-lg backdrop-blur-xl border-2 border-white border-opacity-30">
                            {getOfferText()}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-1.5">{offer.title}</h3>

                        {/* Description */}
                        <p className="text-sm text-white text-opacity-90 mb-2">{offer.description}</p>

                        {/* Code */}
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-medium">Use Code:</span>
                            <div
                                onClick={handleCopyCode}
                                className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-white border-dashed cursor-pointer hover:bg-opacity-30 transition-all relative group"
                            >
                                <code className="text-base font-bold tracking-wider">{offer.code}</code>
                                {copied ? (
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                        ✓ Copied!
                                    </span>
                                ) : (
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to copy
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Valid Until */}
                        <div className="flex items-center space-x-2 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                            {isExpiringSoon() && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                                    ENDING SOON
                                </span>
                            )}
                        </div>

                        {/* Min Purchase */}
                        {offer.minPurchase && (
                            <p className="text-sm mt-2 text-white text-opacity-80">
                                Minimum purchase: ₹{offer.minPurchase}
                            </p>
                        )}
                    </div>

                    {/* Icon */}
                    <div className="hidden md:block">
                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Shop Now Button */}
                <Link to="/products">
                    <button className="mt-3 bg-white text-primary-600 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Shop Now →
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default OfferBanner;
