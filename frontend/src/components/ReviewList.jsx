import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ReviewList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        averageRating: 0,
        pages: 1
    });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, [productId, currentPage]);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/reviews/${productId}?page=${currentPage}`);
            setReviews(data.reviews);
            setStats({
                total: data.total,
                averageRating: data.averageRating,
                pages: data.pages
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ rating }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="card p-6">
                <p className="text-white text-center">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="card p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Customer Reviews</h3>
                {stats.total > 0 ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-yellow-400">
                                {stats.averageRating}
                            </span>
                            <StarRating rating={Math.round(stats.averageRating)} />
                        </div>
                        <span className="text-white">
                            Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
                        </span>
                    </div>
                ) : (
                    <p className="text-white">No reviews yet. Be the first to review!</p>
                )}
            </div>

            {reviews.length > 0 && (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="border-b border-gray-700 pb-4 last:border-b-0"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-white">
                                        {review.user?.name || 'Anonymous'}
                                    </p>
                                    <StarRating rating={review.rating} />
                                </div>
                                <span className="text-sm text-white">
                                    {formatDate(review.createdAt)}
                                </span>
                            </div>
                            <p className="text-white">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {stats.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="flex items-center px-4 text-white">
                        Page {currentPage} of {stats.pages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === stats.pages}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
