const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get user's wishlist
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add product to wishlist
router.post('/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Check if product already in wishlist
        if (user.wishlist.includes(req.params.productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        user.wishlist.push(req.params.productId);
        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove product from wishlist
router.delete('/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.wishlist) {
            user.wishlist = [];
        }

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== req.params.productId
        );

        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clear entire wishlist
router.delete('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist = [];
        await user.save();
        res.json({ message: 'Wishlist cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
