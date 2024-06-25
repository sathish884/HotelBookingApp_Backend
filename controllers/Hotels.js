const Hotel = require("../models/Hotel");
const multer = require("multer");

// Create Hotel
exports.createHotel = async (req, res) => {
    try {
        const { hotelName, amenities, description, address, locations, rooms } = req.body;

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded." });
        }

        // Extract image paths
        const imagePaths = req.files.map(file => file.path);

        // Create a new hotel document
        const newHotel = new Hotel({
            hotelName,
            amenities: amenities ? amenities.split(",") : [],
            description,
            address,
            locations: {
                lat: locations.lat,
                lang: locations.lang
            },
            rooms,
            images: imagePaths
        });

        await newHotel.save();
        res.status(201).json({ message: "Hotel Created Successfully", data: newHotel });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};
// Update the hotels
exports.updateHotel = async (req, res) => {
    try {
        const { hotelId, hotelName, amenities, description, address, locations, rooms } = req.body;

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        const updateData = {
            hotelName,
            amenities: amenities ? amenities.split(",") : [],
            description,
            address,
            locations: locations ? JSON.parse(locations) : {},
            rooms: rooms ? rooms.split(",") : []
        };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        }

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json({ message: "Hotel Updated Successfully", data: hotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Hotel details
exports.getAllHotelList = async (req, res) => {
    try {
        const hotels = await Hotel.find({})
            .populate("rooms")
            .populate("ratings");

        res.status(200).json({ data: hotels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Hotel details
exports.getSingleHotelList = async (req, res) => {
    try {
        const { hotelId } = req.query;

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        const hotel = await Hotel.findById(hotelId)
            .populate("rooms")
            .populate("reviews")
            .populate("ratings");

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json({ data: hotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

