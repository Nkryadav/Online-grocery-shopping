const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
router.get('/sales', protect, admin, async (req, res) => {
    try {
        const { period = 'daily', days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        let groupBy;
        if (period === 'daily') {
            groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        } else if (period === 'weekly') {
            groupBy = { $dateToString: { format: "%Y-W%V", date: "$createdAt" } };
        } else if (period === 'monthly') {
            groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        }

        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(salesData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
router.get('/top-products', protect, admin, async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    name: { $first: "$orderItems.name" },
                    image: { $first: "$orderItems.image" },
                    totalQuantity: { $sum: "$orderItems.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        res.json(topProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get offer revenue analytics
// @route   GET /api/analytics/offer-revenue
// @access  Private/Admin
router.get('/offer-revenue', protect, admin, async (req, res) => {
    try {
        const offerRevenue = await Order.aggregate([
            {
                $match: {
                    appliedOffer: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: "$appliedOffer.code",
                    offerCode: { $first: "$appliedOffer.code" },
                    totalDiscount: { $sum: "$appliedOffer.discountAmount" },
                    orderCount: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { totalDiscount: -1 } }
        ]);

        // Calculate total revenue without offers
        const totalWithoutOffers = await Order.aggregate([
            {
                $match: {
                    $or: [
                        { appliedOffer: { $exists: false } },
                        { appliedOffer: null }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                }
            }
        ]);

        res.json({
            withOffers: offerRevenue,
            withoutOffers: totalWithoutOffers[0] || { totalRevenue: 0, orderCount: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get general statistics
// @route   GET /api/analytics/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        // Total revenue
        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // Total customers
        const totalCustomers = await User.countDocuments({ isAdmin: false });

        // Average order value
        const avgOrderValue = revenueData[0]
            ? revenueData[0].totalRevenue / revenueData[0].totalOrders
            : 0;

        // Recent orders (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await Order.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            totalRevenue: revenueData[0]?.totalRevenue || 0,
            totalOrders: revenueData[0]?.totalOrders || 0,
            totalCustomers,
            avgOrderValue: avgOrderValue.toFixed(2),
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
