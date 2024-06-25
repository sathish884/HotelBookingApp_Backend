const mongoose = require("mongoose");

const RoomShema = new mongoose.Schema(
    {
        roomName: { type: String, required: true },
        amenities: [String],
        price: { type: Number, required: true },
        sharingCount: { type: Number, required: true },
        description: { type: String, required: true },
        images: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rooms", RoomShema)