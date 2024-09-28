const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        rating: { type: Number, required: true },
        reviewcomment: { type: String, required: true },
    },
    { timestamps: true }
);

const ContactSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema); // Use singular name
const Contact = mongoose.model("Contact", ContactSchema); // Use singular name

module.exports = { Review, Contact }; // Ensure you're exporting correctly
