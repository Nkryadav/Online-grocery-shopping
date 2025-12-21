import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminOffers = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        code: '',
        offerType: 'percentage',
        discountValue: '',
        minPurchase: '',
        maxDiscount: '',
        validUntil: ''
    });

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }
        fetchOffers();
    }, [user, navigate]);

    const fetchOffers = async () => {
        try {
            const { data } = await api.get('/offers');
            setOffers(data || []);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const offerData = {
                ...formData,
                validFrom: new Date(),
                validUntil: new Date(formData.validUntil),
                isActive: true
            };
            await api.post('/offers', offerData);
            setShowAddModal(false);
            resetForm();
            fetchOffers();
        } catch (error) {
            alert('Error creating offer: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                await api.delete(`/offers/${id}`);
                fetchOffers();
            } catch (error) {
                alert('Error deleting offer');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            code: '',
            offerType: 'percentage',
            discountValue: '',
            minPurchase: '',
            maxDiscount: '',
            validUntil: ''
        });
    };

    if (loading) {
        return <div className="min-h-screen py-8" ><p className="text-white text-center">Loading...</p></div>;
    }

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Manage Offers & Coupons</h1>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">
                        + Create Coupon
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map(offer => (
                        <div key={offer._id} className="card p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                                <span className={`badge ${offer.isActive ? 'badge-success' : 'badge-warning'}`}>
                                    {offer.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-white mb-4">{offer.description}</p>
                            <div className="bg-gray-700 p-3 rounded-lg mb-4">
                                <p className="text-primary-500 font-mono text-lg font-bold text-center">{offer.code}</p>
                            </div>
                            <div className="space-y-2 text-sm text-white mb-4">
                                <p>• Discount: {offer.offerType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}</p>
                                <p>• Min Purchase: ₹{offer.minPurchase}</p>
                                {offer.maxDiscount && <p>• Max Discount: ₹{offer.maxDiscount}</p>}
                                <p>• Valid Until: {new Date(offer.validUntil).toLocaleDateString()}</p>
                                <p>• Used: {offer.usedCount || 0} times</p>
                            </div>
                            <button onClick={() => handleDelete(offer._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                            <h2 className="text-2xl font-bold text-white mb-4">Create New Coupon</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-white mb-2">Title</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-white mb-2">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="2" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white mb-2">Coupon Code</label>
                                        <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="input-field" placeholder="SAVE20" required />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Offer Type</label>
                                        <select value={formData.offerType} onChange={(e) => setFormData({ ...formData, offerType: e.target.value })} className="input-field">
                                            <option value="percentage">Percentage</option>
                                            <option value="flat">Flat Amount</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Discount Value</label>
                                        <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} className="input-field" placeholder={formData.offerType === 'percentage' ? '20' : '100'} required />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Min Purchase (₹)</label>
                                        <input type="number" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })} className="input-field" required />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Max Discount (₹)</label>
                                        <input type="number" value={formData.maxDiscount} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })} className="input-field" placeholder="Optional" />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Valid Until</label>
                                        <input type="date" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} className="input-field" required />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="btn-primary flex-1">Create Coupon</button>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOffers;
