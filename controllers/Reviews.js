const Reviews = require("../models/Reviews");
const Hotels = require("../models/Hotel");

// Create Review
exports.createReview = async (req, res) => {
    try {
        const { reviewcomment, userId } = req.body;

        const newReview = new Reviews({
            reviewcomment,
            user: userId,
        });

        await newReview.save();

        res.status(200).json({ message: "Review Created successfully", data: newReview })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get reviews based on hotel
exports.getAllReviewsByHotel = async (req, res) => {
    try {
        // Find the hotel by ID and populate the reviews
        const review = await Reviews.find({});
        res.status(200).json({ data: review }); // Return only the reviews
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.query;

        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }

        const review = await Reviews.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

