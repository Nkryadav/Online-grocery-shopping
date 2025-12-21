import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center card p-8">
                        <svg className="w-32 h-32 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-3xl font-bold mb-4 text-white">Your cart is empty</h2>
                        <p className="text-white mb-8">Add some fresh groceries to get started!</p>
                        <Link to="/products">
                            <button className="btn-primary">
                                Browse Products
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const tax = subtotal * 0.05; // 5% tax
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping;

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const discountedPrice = item.discount > 0
                                ? item.price - (item.price * item.discount) / 100
                                : item.price;

                            return (
                                <div key={item._id} className="card p-4">
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <Link to={`/product/${item._id}`}>
                                            <img
                                                src={item.image || 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <Link to={`/product/${item._id}`}>
                                                <h3 className="text-lg font-semibold hover:text-primary-600 transition-colors text-white">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-white">{item.category}</p>

                                            <div className="mt-2">
                                                {item.discount > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold text-primary-600">
                                                            ₹{discountedPrice.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-white line-through">
                                                            ₹{item.price.toFixed(2)}
                                                        </span>
                                                        <span className="badge badge-danger">
                                                            {item.discount}% OFF
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xl font-bold">₹{item.price.toFixed(2)}</span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-white hover:bg-opacity-10 transition-colors text-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 py-1 border-x border-white border-opacity-20 text-gray-100">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-white hover:bg-opacity-10 transition-colors text-gray-100"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-red-600 hover:text-red-700 font-medium transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold">
                                                ₹{(discountedPrice * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-white">Subtotal</span>
                                    <span className="font-semibold text-white">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white">Tax (5%)</span>
                                    <span className="font-semibold text-white">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white">Shipping</span>
                                    <span className="font-semibold text-white">
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-sm text-white">
                                        Add ₹{(500 - subtotal).toFixed(2)} more for free shipping
                                    </p>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary-600">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="btn-primary w-full mb-4"
                            >
                                Proceed to Checkout
                            </button>

                            <Link to="/products">
                                <button className="btn-secondary w-full">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
