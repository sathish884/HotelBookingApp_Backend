const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    hotelName: { type: String, required: true },
    amenities: [String],
    description: { type: String, required: true },
    address: { type: String, required: true },
    locations: {
        lat: { type: Number},
        lang: { type: Number}
    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rooms" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ratings" }],
    images: [String]
}, { timestamps: true });

module.exports = mongoose.model("Hotels", hotelSchema);