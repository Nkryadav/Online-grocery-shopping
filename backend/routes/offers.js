const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect, admin } = require('../middleware/auth');

// Get all active offers
router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now }
        }).populate('applicableProducts', 'name price image');

        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get personalized offers for user
router.get('/personalized', protect, async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
            offerType: { $in: ['percentage', 'flat', 'bogo'] }
        }).populate('applicableProducts', 'name price image category')
            .sort({ discountValue: -1 })
            .limit(10);

        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single offer
router.get('/:id', async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id)
            .populate('applicableProducts', 'name price image');

        if (offer) {
            res.json(offer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Validate offer code
router.post('/validate', protect, async (req, res) => {
    try {
        const { code, cartTotal, productIds } = req.body;
        const now = new Date();

        const offer = await Offer.findOne({
            code: code.toUpperCase(),
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now }
        });

        if (!offer) {
            return res.status(404).json({ message: 'Invalid or expired offer code' });
        }

        // Check minimum purchase
        if (offer.minPurchase && cartTotal < offer.minPurchase) {
            return res.status(400).json({
                message: `Minimum purchase of ₹${offer.minPurchase} required`
            });
        }

        // Check usage limit
        if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
            return res.status(400).json({ message: 'Offer usage limit reached' });
        }

        // Check applicable products
        if (offer.applicableProducts.length > 0) {
            const hasApplicableProduct = productIds.some(id =>
                offer.applicableProducts.includes(id)
            );
            if (!hasApplicableProduct) {
                return res.status(400).json({
                    message: 'This offer is not applicable to items in your cart'
                });
            }
        }

        // Calculate discount
        let discount = 0;
        if (offer.offerType === 'percentage') {
            discount = (cartTotal * offer.discountValue) / 100;
            if (offer.maxDiscount) {
                discount = Math.min(discount, offer.maxDiscount);
            }
        } else if (offer.offerType === 'flat') {
            discount = offer.discountValue;
        }

        res.json({
            valid: true,
            offer: {
                id: offer._id,
                title: offer.title,
                code: offer.code,
                discountValue: offer.discountValue,
                offerType: offer.offerType
            },
            discount: Math.round(discount * 100) / 100
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create offer (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const offer = new Offer(req.body);
        const createdOffer = await offer.save();
        res.status(201).json(createdOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update offer (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            Object.assign(offer, req.body);
            const updatedOffer = await offer.save();
            res.json(updatedOffer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete offer (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            await offer.deleteOne();
            res.json({ message: 'Offer removed' });
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
