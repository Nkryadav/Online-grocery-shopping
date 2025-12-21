import React, { useState } from 'react';
import api from '../api/axios';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post(`/reviews/${productId}`, {
                rating,
                comment
            });
            setSuccess('Review submitted successfully!');
            setComment('');
            setRating(5);
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const StarIcon = ({ filled, onHover, onClick }) => (
        <svg
            className={`w-8 h-8 cursor-pointer transition-all ${filled ? 'text-yellow-400' : 'text-gray-600'
                } hover:scale-110`}
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            onMouseEnter={onHover}
            onClick={onClick}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
        </svg>
    );

    return (
        <div className="card p-6">
            <h3 className="text-2xl font-bold mb-4 text-white">Write a Review</h3>

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

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                        Your Rating
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                filled={star <= (hoveredRating || rating)}
                                onHover={() => setHoveredRating(star)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <div
                        className="mt-2"
                        onMouseLeave={() => setHoveredRating(0)}
                    >
                        <span className="text-white">
                            {hoveredRating || rating} {hoveredRating || rating === 1 ? 'star' : 'stars'}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                        Your Review
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        maxLength={500}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Share your experience with this product..."
                    />
                    <p className="text-sm text-white mt-1">
                        {comment.length}/500 characters
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading || !comment.trim()}
                    className="btn-primary w-full"
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
