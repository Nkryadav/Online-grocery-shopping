const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    image: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    unit: {
        type: String,
        required: true,
        default: 'piece',
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    reviews: [reviewSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
