const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotels", required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reviews", ReviewSchema)