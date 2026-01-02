const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Offer = require('../models/Offer');
const { protect, admin } = require('../middleware/auth');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

// Create Razorpay order
router.post('/create-razorpay-order', protect, async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(503).json({
                message: 'Payment gateway not configured. Please contact administrator.'
            });
        }

        const { amount } = req.body;

        const options = {
            amount: Math.round(amount * 100), // amount in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);
        res.json(razorpayOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify Razorpay payment
router.post('/verify-payment', protect, async (req, res) => {
    try {
        if (!razorpay || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(503).json({
                message: 'Payment gateway not configured. Please contact administrator.'
            });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new order
router.post('/', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            offerCode
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        let discount = 0;
        let offerApplied = null;

        // Apply offer if code provided
        if (offerCode) {
            const offer = await Offer.findOne({
                code: offerCode.toUpperCase(),
                isActive: true
            });

            if (offer) {
                if (offer.offerType === 'percentage') {
                    discount = (itemsPrice * offer.discountValue) / 100;
                    if (offer.maxDiscount) {
                        discount = Math.min(discount, offer.maxDiscount);
                    }
                } else if (offer.offerType === 'flat') {
                    discount = offer.discountValue;
                }

                // Update offer usage
                offer.usedCount += 1;
                await offer.save();
                offerApplied = offer._id;
            }
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice: totalPrice - discount,
            discount,
            offerApplied
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('offerApplied', 'title code');

        if (order) {
            // Check if user owns this order or is admin
            if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
                res.json(order);
            } else {
                res.status(401).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order to paid
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            order.status = 'processing';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get logged in user orders
router.get('/myorders/list', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('offerApplied', 'title code');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order to delivered (Admin only)
router.put('/:id/deliver', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.status = 'delivered';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete order (User can delete own order, Admin can delete any)
router.delete('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order or is admin
        if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to delete this order' });
        }

        await Order.deleteOne({ _id: req.params.id });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
