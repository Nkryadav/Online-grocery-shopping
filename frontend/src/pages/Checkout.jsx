import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import SuccessModal from '../components/SuccessModal';

const Checkout = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [offerCode, setOfferCode] = useState('');
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        address: user?.shippingAddress?.address || '',
        city: user?.shippingAddress?.city || '',
        postalCode: user?.shippingAddress?.postalCode || '',
        country: user?.shippingAddress?.country || 'India',
        paymentMethod: 'cash',
    });

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
        }
    }, [isAuthenticated, navigate]);



    const subtotal = getCartTotal();
    const tax = subtotal * 0.05;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping - discount;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleApplyOffer = async () => {
        if (!offerCode.trim()) return;

        try {
            const productIds = cartItems.map(item => item._id);
            const { data } = await api.post('/offers/validate', {
                code: offerCode,
                cartTotal: subtotal,
                productIds,
            });

            if (data.valid) {
                setAppliedOffer(data.offer);
                setDiscount(data.discount);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid offer code');
            setAppliedOffer(null);
            setDiscount(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Create order in database
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.discount > 0
                        ? item.price - (item.price * item.discount) / 100
                        : item.price,
                    image: item.image,
                })),
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                },
                paymentMethod: 'cash',
                itemsPrice: subtotal,
                taxPrice: tax,
                shippingPrice: shipping,
                totalPrice: total,
                offerCode: appliedOffer?.code || '',
            };

            const { data: order } = await api.post('/orders', orderData);
            console.log('Order created:', order);

            // Cash on Delivery - Order placed successfully
            clearCart();
            setSuccessMessage('Your order has been placed successfully! Pay on delivery.');
            setShowSuccess(true);
            setLoading(false);
        } catch (err) {
            console.error('Order creation error:', err);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/products');
    };

    return (
        <div className="min-h-screen py-8" >
            <SuccessModal
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                message={successMessage}
                title="Order Placed Successfully! 🎉"
            />
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-white">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="card p-6">
                                <h2 className="text-2xl font-bold mb-4 text-white">Shipping Address</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
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
                                                required
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
                                                required
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
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="card p-6">
                                <h2 className="text-2xl font-bold mb-4 text-white">Payment Method</h2>
                                <div className="p-4 border-2 border-primary-500 rounded-lg bg-primary-500 bg-opacity-10">
                                    <div className="flex items-center">
                                        <svg className="w-8 h-8 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <div>
                                            <p className="font-bold text-lg text-white">Cash on Delivery</p>
                                            <p className="text-sm text-white">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card p-6 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>

                                {/* Apply Offer */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2 text-white">Have a coupon code?</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={offerCode}
                                            onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                                            className="input-field flex-1"
                                            placeholder="OFFER CODE"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyOffer}
                                            className="btn-secondary"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {appliedOffer && (
                                        <p className="text-sm text-green-600 mt-2">
                                            ✓ {appliedOffer.title} applied!
                                        </p>
                                    )}
                                    {error && (
                                        <p className="text-sm text-red-600 mt-2">{error}</p>
                                    )}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-white">Subtotal</span>
                                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white">Tax (5%)</span>
                                        <span className="font-semibold">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white">Shipping</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary-600">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full"
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
