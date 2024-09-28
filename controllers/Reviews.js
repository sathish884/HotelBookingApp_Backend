const { Review, Contact } = require("../models/Reviews");

// Create Review
exports.createReview = async (req, res) => {
    try {
        const { username, email, rating, reviewcomment } = req.body;

        const newReview = new Review({
            username,
            email,
            rating,
            reviewcomment
        });

        await newReview.save();

        res.status(200).json({ message: "Review created successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get reviews based on hotel
exports.getAllReviewsByHotel = async (req, res) => {
    try {
        // Find the hotel by ID and populate the reviews
        const review = await Review.find({});
        res.status(200).send(review); // Return only the reviews
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

        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Contact
exports.createContact = async (req, res) => {
    try {
        const { username, email, message } = req.body;

        const newContact = new Contact({
            username,
            email,
            message
        });

        await newContact.save();

        res.status(200).json({ message: "Contact created successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Review
exports.deleteContact = async (req, res) => {
    try {
        const { contactId } = req.query;

        if (!contactId) {
            return res.status(400).json({ message: "Contact ID is required" });
        }

        const contact = await Contact.findByIdAndDelete(contactId);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json({ message: "Contact details deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
