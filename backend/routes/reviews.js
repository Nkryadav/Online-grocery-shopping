const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = 10;

        const count = await Review.countDocuments({ product: req.params.productId });
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        // Calculate average rating
        const allReviews = await Review.find({ product: req.params.productId });
        const avgRating = allReviews.length > 0
            ? allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length
            : 0;

        res.json({
            reviews,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
            averageRating: avgRating.toFixed(1)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a review
router.post('/:productId', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: req.params.productId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({
            user: req.user._id,
            product: req.params.productId,
            rating: Number(rating),
            comment
        });

        await review.save();

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a review
router.put('/:reviewId', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this review' });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;

        const updatedReview = await review.save();
        res.json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a review
router.delete('/:reviewId', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
