const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an offer title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide an offer description'],
    },
    code: {
        type: String,
        required: [true, 'Please provide an offer code'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    offerType: {
        type: String,
        required: true,
        enum: ['percentage', 'flat', 'bogo'],
        default: 'percentage',
    },
    discountValue: {
        type: Number,
        required: [true, 'Please provide a discount value'],
        min: 0,
    },
    validFrom: {
        type: Date,
        required: true,
        default: Date.now,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    minPurchase: {
        type: Number,
        default: 0,
    },
    maxDiscount: {
        type: Number,
    },
    usageLimit: {
        type: Number,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
offerSchema.index({ code: 1, isActive: 1 });
offerSchema.index({ validFrom: 1, validUntil: 1 });

module.exports = mongoose.model('Offer', offerSchema);
