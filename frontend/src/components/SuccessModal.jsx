import React from 'react';

const SuccessModal = ({ isOpen, onClose, message, title = "Success!" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-gray-800 bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scaleIn border border-gray-700">
                {/* Success Icon with Animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-pulse-glow">
                            <svg className="w-12 h-12 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        {/* Confetti circles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-confetti-1"></div>
                        <div className="absolute -top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-confetti-2"></div>
                        <div className="absolute top-0 -left-4 w-3 h-3 bg-pink-400 rounded-full animate-confetti-3"></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-confetti-4"></div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-white mb-4 animate-slideUp">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-center text-white mb-8 text-lg animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    {message}
                </p>

                {/* Button */}
                <button
                    onClick={onClose}
                    className="w-full btn-primary text-lg py-4 animate-slideUp"
                    style={{ animationDelay: '0.2s' }}
                >
                    Continue Shopping 🛒
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
