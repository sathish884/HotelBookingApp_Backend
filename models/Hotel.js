const mongoose = require("mongoose");

const HotelShema = new mongoose.Schema(
    {
        hotelName: { type: String, required: true },
        amenities: [String],
        description: { type: String, required: true },
        image: { type: String, required: true },
        address: { type: String, required: true },
        locations: {
            lat: { type: String, required: true },
            lang: { type: String, required: true },
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rooms" }],
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
        ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ratings" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Hotels", HotelShema);