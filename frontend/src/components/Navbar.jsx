import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { getCartCount } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const cartCount = getCartCount();
    const wishlistCount = wishlist.length;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-gradient">FreshMart</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Products
                        </Link>
                        <Link to="/offers" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Offers
                        </Link>
                        {isAuthenticated && (
                            user?.isAdmin ? (
                                <>
                                    <Link to="/admin/orders" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                        Orders
                                    </Link>
                                    <Link to="/admin/analytics" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                        Analytics
                                    </Link>
                                </>
                            ) : (
                                <Link to="/orders" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                    My Orders
                                </Link>
                            )
                        )}
                        {isAuthenticated && user?.isAdmin && (
                            <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors bg-primary-100 px-3 py-1 rounded-lg">
                                🔧 Admin Panel
                            </Link>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Wishlist - Hide for admin users */}
                        {!user?.isAdmin && isAuthenticated && (
                            <Link to="/wishlist" className="relative">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </button>
                            </Link>
                        )}

                        {/* Cart - Hide for admin users */}
                        {!user?.isAdmin && (
                            <Link to="/cart" className="relative">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <Link to="/profile" className="text-gray-700 hover:text-primary-600 font-medium">
                                    {user?.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="btn-primary">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
