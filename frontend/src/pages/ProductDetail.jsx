import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    // Review states
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            const response = await api.get(`/reviews/${id}`);
            setReviews(response.data.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setSubmittingReview(true);
            await api.post(`/reviews/${id}`, reviewForm);
            setReviewForm({ rating: 5, comment: '' });
            setShowReviewForm(false);
            fetchReviews();
            fetchProduct();
            alert('Review submitted successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        for (let i = 0; i < quantity; i++) {
            await addToCart(product);
        }
        setAddingToCart(false);
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setWishlistLoading(true);
        if (isInWishlist(product._id)) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product._id);
        }
        setWishlistLoading(false);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-white">Product not found</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="mt-4 btn-primary"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    const inWishlist = isInWishlist(product._id);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
                <ol className="flex items-center space-x-2 text-gray-400">
                    <li>
                        <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">
                            Home
                        </button>
                    </li>
                    <li>/</li>
                    <li>
                        <button onClick={() => navigate('/products')} className="hover:text-primary-600 transition-colors">
                            Products
                        </button>
                    </li>
                    <li>/</li>
                    <li className="text-white">{product.name}</li>
                </ol>
            </nav>

            {/* Product Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side - Product Image */}
                <div className="relative">
                    <div className="sticky top-24">
                        <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={product.image || 'https://via.placeholder.com/600x600?text=Product'}
                                alt={product.name}
                                className="w-full h-auto object-cover"
                            />

                            {/* Discount Badge */}
                            {product.discount > 0 && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                                    {product.discount}% OFF
                                </div>
                            )}

                            {/* Stock Badge */}
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                    <span className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-xl">
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side - Product Info */}
                <div className="space-y-6">
                    {/* Category */}
                    <div>
                        <span className="inline-block bg-primary-600 bg-opacity-20 text-primary-600 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                            {product.category}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-4xl font-bold text-white leading-tight">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-6 h-6 ${i < Math.floor(product.rating || 0)
                                        ? 'text-yellow-400'
                                        : 'text-gray-600'
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-lg text-gray-300">
                            {product.rating ? product.rating.toFixed(1) : '0.0'}
                        </span>
                        <span className="text-gray-400">
                            ({product.numReviews || 0} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="border-t border-b border-gray-700 py-6">
                        {product.discount > 0 ? (
                            <div className="space-y-2">
                                <div className="flex items-baseline space-x-3">
                                    <span className="text-5xl font-bold text-primary-600">
                                        ₹{discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-2xl text-gray-400 line-through">
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-green-500 font-semibold">
                                    You save ₹{(product.price - discountedPrice).toFixed(2)} ({product.discount}%)
                                </p>
                            </div>
                        ) : (
                            <span className="text-5xl font-bold text-primary-600">
                                ₹{product.price.toFixed(2)}
                            </span>
                        )}
                        <span className="text-lg text-gray-300 ml-2">/{product.unit}</span>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3">Description</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {product.description || 'No description available for this product.'}
                        </p>
                    </div>

                    {/* Stock Availability */}
                    <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-white">Availability:</span>
                        {product.stock > 0 ? (
                            <span className="text-green-500 font-semibold text-lg">
                                In Stock ({product.stock} units available)
                            </span>
                        ) : (
                            <span className="text-red-500 font-semibold text-lg">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Quantity Selector & Add to Cart - Only for non-admin users */}
                    {(!user || !user.isAdmin) && (
                        <div className="space-y-4 pt-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-4">
                                <span className="text-lg font-semibold text-white">Quantity:</span>
                                <div className="flex items-center border-2 border-gray-600 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="px-8 py-3 bg-gray-800 text-white font-bold text-xl min-w-[80px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || addingToCart}
                                    className={`flex-1 py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 ${product.stock === 0
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                                        }`}
                                >
                                    {addingToCart ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Adding...
                                        </span>
                                    ) : product.stock === 0 ? (
                                        'Out of Stock'
                                    ) : (
                                        'Add to Cart'
                                    )}
                                </button>

                                {/* Wishlist Button */}
                                {user && (
                                    <button
                                        onClick={handleWishlistToggle}
                                        disabled={wishlistLoading}
                                        className={`px-6 py-4 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${inWishlist
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                            }`}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill={inWishlist ? 'currentColor' : 'none'}
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-white">Customer Reviews</h2>
                    {user && !user.isAdmin && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="btn-primary"
                        >
                            {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <div className="card p-6 mb-8">
                        <h3 className="text-xl font-bold text-white mb-4">Write Your Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            {/* Rating */}
                            <div>
                                <label className="block text-white font-semibold mb-2">Rating</label>
                                <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <svg
                                                className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                    <span className="text-white ml-2">({reviewForm.rating} stars)</span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-white font-semibold mb-2">Your Review</label>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    required
                                    maxLength={500}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-600 focus:outline-none"
                                    placeholder="Share your experience with this product..."
                                />
                                <p className="text-sm text-gray-400 mt-1">
                                    {reviewForm.comment.length}/500 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submittingReview || !reviewForm.comment.trim()}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviewsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="card p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{review.user?.name || 'Anonymous'}</h4>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <div className="card p-8 text-center">
                            <p className="text-gray-400 text-lg">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
