const Hotel = require('../models/Hotel'); // Adjust the path accordingly
const multer = require('multer');
const path = require('path');


exports.createHotel = async (req, res) => {
    try {
        const { hotelName, amenities, description, address } = req.body;

        const locations = {
            lat: parseFloat(req.body['locations.lat']),
            lang: parseFloat(req.body['locations.lang'])
        };

        // Validate locations
        if (isNaN(locations.lat) || isNaN(locations.lang)) {
            return res.status(400).json({ message: "Invalid latitude or longitude value." });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded." });
        }

        // Extract filenames from file paths
        const imagePaths = req.files.map(file => path.basename(file.path));

        // Create a new hotel document
        const newHotel = new Hotel({
            hotelName,
            amenities: amenities ? amenities.split(",") : [],
            description,
            address,
            locations,
            images: imagePaths
        });

        await newHotel.save();
        console.log('Received request body:', req.body);
        res.status(201).json({ message: "Hotel Created Successfully", data: newHotel });
    } catch (error) {
        console.error(error);
        if (error instanceof multer.MulterError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

exports.updateHotel = async (req, res) => {
    try {
        const { hotelId } = req.query;

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => path.basename(file.path));
        }

        req.body.amenities = req.body.amenities ? req.body.amenities.split(",") : [];

        const newHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!newHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        return res.status(200).json({ message: "Hotel updated successfully", data: newHotel });
    } catch (error) {
        console.error(error);
        if (error instanceof multer.MulterError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Get All Hotel details
exports.getAllHotelList = async (req, res) => {
    try {
        const hotels = await Hotel.find({})
            .populate("rooms")
            .populate("ratings");

        res.status(200).send(hotels)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSingleHotelList = async (req, res) => {
    try {
        const { hotelId } = req.query;

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        const hotel = await Hotel.findById(hotelId)
            // .populate("rooms")
            // .populate("reviews")
            // .populate("ratings");

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json({ data: hotel });
    } catch (error) {
        console.error(error.message); // Log the error for debugging purposes
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete the hotel
exports.deleteHotel = async (req, res) => {
    try {
        const { hotelId } = req.query;

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        const hotel = await Hotel.findByIdAndDelete(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

