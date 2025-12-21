import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart, cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    // Get the quantity of this product in the cart
    const cartItem = cartItems.find(item => item._id === product._id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        if (!user) return;

        setWishlistLoading(true);
        if (isInWishlist(product._id)) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product._id);
        }
        setWishlistLoading(false);
    };

    const inWishlist = isInWishlist(product._id);

    return (
        <div className="card group h-full flex flex-col">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 h-48">
                <img
                    src={product.image || 'https://via.placeholder.com/300x200?text=Product'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Wishlist Heart Button - Only show for non-admin users */}
                {user && !user.isAdmin && (
                    <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className="absolute top-2 left-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all shadow-lg disabled:opacity-50"
                    >
                        <svg
                            className={`w-5 h-5 transition-colors ${inWishlist ? 'text-red-600 fill-current' : 'text-gray-600'}`}
                            fill={inWishlist ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {product.discount}% OFF
                    </div>
                )}

                {/* Stock Badge */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Category */}
                <span className="text-sm text-primary-600 font-semibold uppercase tracking-wide">
                    {product.category}
                </span>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-white mt-1 line-clamp-2 flex-1">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mt-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-white'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm text-white ml-2">
                        ({product.numReviews || 0})
                    </span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center justify-between">
                    <div>
                        {product.discount > 0 ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-primary-600">
                                    ₹{discountedPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-200 line-through">
                                    ₹{product.price.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-primary-600">
                                ₹{product.price.toFixed(2)}
                            </span>
                        )}
                        <span className="text-sm text-gray-200 ml-1">/{product.unit}</span>
                    </div>
                </div>

                {/* Add to Cart Button - Only show for non-admin users */}
                {(!user || !user.isAdmin) && (
                    <div className="relative mt-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${product.stock === 0
                                ? 'bg-gray-300 text-gray-200 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                }`}
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        {/* Cart Counter Badge */}
                        {cartQuantity > 0 && (
                            <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                                {cartQuantity}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
