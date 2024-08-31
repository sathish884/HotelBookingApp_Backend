const mongoose = require("mongoose");

const RoomShema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        amenities: [String],
        description: { type: String, required: true },
        rentperday: { type: Number, required: true },
        maxCount: { type: Number, required: true },
        imagesurls: [String],
        currentbooking: [],
        type: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rooms", RoomShema)