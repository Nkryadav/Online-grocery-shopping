import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { user } = useAuth();
    return (
        <footer className="bg-gray-900 text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold">FreshMart</span>
                        </div>
                        <p className="text-white">
                            Your one-stop shop for fresh groceries with amazing offers and deals.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-white hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-white hover:text-white transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/offers" className="text-white hover:text-white transition-colors">
                                    Offers
                                </Link>
                            </li>
                            {/* Hide Cart link for admin users */}
                            {!user?.isAdmin && (
                                <li>
                                    <Link to="/cart" className="text-white hover:text-white transition-colors">
                                        Cart
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/orders" className="text-white hover:text-white transition-colors">
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@freshmart.com" className="text-white hover:text-white transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-white">
                            <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:support@freshmart.com" className="hover:text-white transition-colors">
                                    support@freshmart.com
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:+12345678900" className="hover:text-white transition-colors">
                                    +1 234 567 8900
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-white">
                    <p>&copy; 2024 FreshMart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
