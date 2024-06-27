const Ratings = require("../models/Ratings");
const Hotels = require("../models/Hotel");

// Add Rating for Hotel
exports.createRating = async (req, res) => {
    try {
        const {hotelId} = req.query;
        const { rating, userId } = req.body;

        // Check if the hotel exists
        const hotel = await Hotels.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const newRating = new Ratings({
            rating,
            user: userId,
            hotel: hotelId
        });
        
        await newRating.save();

        res.status(200).json({ message: "Rating Created successfully", data: newRating })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all ratings for Hotel
exports.getRaings = async (req, res) =>{
    try {
        const {hotelId} = req.query;

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        const ratings = await Ratings.find({hotel:hotelId}).populate('user');

         if (!ratings) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json({data:ratings});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// // Update Review
// exports.updateRe = async (req, res) => {
//     try {
//         const { reviewId, comment } = req.body;
//         // Check if the review ID is provided
//         if (!reviewId) {
//             return res.status(400).json({ message: "Review ID is required" });
//         }
//         const updatedReview = await Reviews.findByIdAndUpdate(reviewId, { comment }, {
//             new: true,
//             runValidators: true
//         });
//         // Check if the review exists
//         if (!updatedReview) {
//             return res.status(404).json({ message: "Review not found" });
//         }
//         await updatedReview.save();
//         res.status(200).json({ message: "Review Updated successfully " })
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }

// // Get reviews based on hotel
// exports.getReviewsByHotel = async (req, res) => {
//     try {
//         const { hotelId } = req.query; // Extract hotelId from query parameters

//         if (!hotelId) {
//             return res.status(400).json({ message: "Hotel ID is required" });
//         }

//         // Find the hotel by ID and populate the reviews
//         const hotel = await Hotels.findById(hotelId).populate('reviews');

//         if (!hotel) {
//             return res.status(404).json({ message: "Hotel not found" });
//         }

//         res.status(200).json({ data: hotel.reviews }); // Return only the reviews
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Delete Review
// exports.deleteReview = async (req, res) => {
//     try {
//         const { reviewId } = req.query;

//         if (!reviewId) {
//             return res.status(400).json({ message: "Review ID is required" });
//         }

//         const review = await Reviews.findByIdAndDelete(reviewId);

//         if (!review) {
//             return res.status(404).json({ message: "Review not found" });
//         }

//         res.status(200).json({ message: "Review deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

