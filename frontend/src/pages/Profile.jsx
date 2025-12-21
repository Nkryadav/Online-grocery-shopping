import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0
    });

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.shippingAddress?.address || '',
        city: user?.shippingAddress?.city || '',
        postalCode: user?.shippingAddress?.postalCode || '',
        country: user?.shippingAddress?.country || 'India',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const { data } = await api.get('/orders/myorders/list');
            const totalSpent = data.reduce((sum, order) => sum + order.totalPrice, 0);
            setStats({
                totalOrders: data.length,
                totalSpent
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.put('/users/profile', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country
                }
            });

            updateUser(data);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await api.put('/users/profile', {
                password: passwordData.newPassword
            });

            setSuccess('Password updated successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-white">My Profile</h1>

                {/* Stats Cards - Only for Customers */}
                {!user?.isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm mb-1">Total Orders</p>
                                    <h3 className="text-3xl font-bold text-white">{stats.totalOrders}</h3>
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
                                    <p className="text-white text-sm mb-1">Total Spent</p>
                                    <h3 className="text-3xl font-bold text-white">₹{stats.totalSpent.toFixed(0)}</h3>
                                </div>
                                <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Admin Info Card */}
                {user?.isAdmin && (
                    <div className="card p-6 mb-8 bg-gradient-to-r from-primary-500 bg-opacity-10 to-transparent border border-primary-500 border-opacity-30">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Administrator Account</h2>
                                <p className="text-white">You have full access to manage the platform</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 text-green-300 rounded-lg">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Information */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-6 text-white">Profile Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Street address"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-6 text-white">Change Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="input-field"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="input-field"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="input-field"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                            >
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
