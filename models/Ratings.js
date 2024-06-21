const mongoose = require("mongoose");

const RatingShema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        hotel: { type: mongoose.Schema.Types.ObjectId, res: "Hotels" },
        rating: { type: Number, required: true, min: 1, max: 5 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ratings", RatingShema)