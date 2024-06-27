const Reviews = require("../models/Reviews");
const Hotels = require("../models/Hotel");

// Create Review
exports.createReview = async (req, res) => {
    try {
        const {hotelId} = req.query;
        const { comment, userId } = req.body;

        // Check if the hotel exists
        const hotel = await Hotels.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const newReview = new Reviews({
            comment,
            user: userId,
            hotel: hotelId
        });

        await newReview.save();

        res.status(200).json({ message: "Review Created successfully", data: newReview })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update Review
exports.updateReview = async (req, res) => {
    try {
        const reviewId = req.query;
        const updatedComments = req.body;

        // Check if the review ID is provided
        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }

        const updatedReview = await Reviews.findByIdAndUpdate(reviewId, updatedComments, {
            new: true,
            runValidators: true
        });

        // Check if the review exists
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        await updatedReview.save();
        
        res.status(200).json({ message: "Review Updated successfully " })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get reviews based on hotel
exports.getReviewsByHotel = async (req, res) => {
    try {
        const { hotelId } = req.query; // Extract hotelId from query parameters

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        // Find the hotel by ID and populate the reviews
        const review = await Reviews.find({hotel:hotelId}).populate('user');

        if (!review) {
            return res.status(404).json({ message: "Hotel not found" });
        }

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

