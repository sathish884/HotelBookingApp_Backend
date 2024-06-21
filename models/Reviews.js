const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotels" },
        comment: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reviews", ReviewSchema)