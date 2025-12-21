import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist();
    const { addToCart } = useCart();

    const handleRemove = async (productId) => {
        await removeFromWishlist(productId);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8" >
                <div className="container mx-auto px-4">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-white">Loading wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen py-16" >
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <svg className="w-32 h-32 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
                        <p className="text-white mb-8">Save your favorite products to buy them later!</p>
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

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">❤️ My Wishlist</h1>
                        <p className="text-white">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                    </div>
                    {wishlist.length > 0 && (
                        <button
                            onClick={clearWishlist}
                            className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => {
                        const discountedPrice = product.discount > 0
                            ? product.price - (product.price * product.discount) / 100
                            : product.price;

                        return (
                            <div key={product._id} className="card overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="relative">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    {product.discount > 0 && (
                                        <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
                                            {product.discount}% OFF
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleRemove(product._id)}
                                        className="absolute top-2 left-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
                                    >
                                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                                    <p className="text-sm text-white mb-2">{product.category}</p>

                                    <div className="flex items-center gap-2 mb-4">
                                        {product.discount > 0 ? (
                                            <>
                                                <span className="text-xl font-bold text-primary-600">
                                                    ₹{discountedPrice.toFixed(2)}
                                                </span>
                                                <span className="text-sm text-white line-through">
                                                    ₹{product.price.toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold">₹{product.price.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="btn-primary flex-1 text-sm"
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
