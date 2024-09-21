const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        reviewcomment: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reviews", ReviewSchema)