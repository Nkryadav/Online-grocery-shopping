const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const { sendEmail, getPasswordResetEmail } = require('../config/email');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const token = user.generateAuthToken();
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token,
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = user.generateAuthToken();
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.shippingAddress) {
                user.shippingAddress = req.body.shippingAddress;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                shippingAddress: updatedUser.shippingAddress,
                token: updatedUser.generateAuthToken(),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID (Admin only)
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No user found with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // Check if email is configured
        const isEmailConfigured = process.env.EMAIL_USER &&
            process.env.EMAIL_USER !== 'your-email@gmail.com' &&
            process.env.EMAIL_PASS &&
            process.env.EMAIL_PASS !== 'your-app-password';

        if (!isEmailConfigured) {
            // Development mode - log to console
            console.log('\n========================================');
            console.log('🔐 PASSWORD RESET REQUEST');
            console.log('========================================');
            console.log('User:', user.email);
            console.log('Reset Link:', resetUrl);
            console.log('Token expires in: 10 minutes');
            console.log('========================================\n');

            return res.json({
                message: 'Password reset link generated (Check backend console for link)',
                resetUrl: resetUrl // Only in development
            });
        }

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request - FreshMart',
                html: getPasswordResetEmail(resetUrl, user.name),
            });

            res.json({ message: 'Password reset email sent successfully' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset password
router.put('/reset-password/:resetToken', async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        const token = user.generateAuthToken();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
            message: 'Password reset successful',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
