const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        required: true
    },

    continent: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    travelType: {
        type: String
    },

    budget: {
        type: String
    },

    featured: {
        type: Boolean,
        default: false
    },

    tags: [{
        type: String
    }],

    rating: {
        type: Number,
        default: 0
    },

    imageUrl: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Destination", destinationSchema);
