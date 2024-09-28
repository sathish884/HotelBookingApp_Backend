const { Rooms, Amenities } = require("../models/Rooms");

// Create Room Controller
exports.createRoom = async (req, res) => {
    try {
        const { name, bed, amenities, description, rentperday, maxCount, currentbooking, type, imagesurls } = req.body;

        // Find amenities by their ObjectId
        const foundAmenities = await Amenities.find({ _id: { $in: amenities } });

        const newRoom = new Rooms({
            name,
            bed,
            amenities: foundAmenities.map(amenity => amenity._id), // Link amenities by ID
            description,
            rentperday,
            maxCount,
            currentbooking,
            type,
            imagesurls
        });

        await newRoom.save();
        res.status(201).json({ message: "Room Created Successfully", data: newRoom });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create Amenities Controller
exports.createAmenities = async (req, res) => {
    try {
        const { name } = req.body;

        const newAmenities = new Amenities({
            name
        });

        await newAmenities.save();
        res.status(201).json({ message: "Amenities Created Successfully", data: newAmenities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update Rooms
exports.updateRoom = async (req, res) => {
    try {
        const { roomId } = req.query; // Destructure roomId from query parameters

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }

        const updatedRoom = await Rooms.findByIdAndUpdate(
            roomId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        return res.status(200).json({
            message: "Room updated successfully",
            data: updatedRoom
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: error.message });
    }
};

// Get All Rooms list with amenities details
exports.getAllRoomList = async (req, res) => {
    try {
        const rooms = await Rooms.find({}).populate('amenities', 'name _id');
        res.status(200).send(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All amenities details
exports.getAllAmenities = async (req, res) => {
    try {
        const rooms = await Amenities.find({});
        res.status(200).send(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Single Room with amenities details
exports.getSingleRoom = async (req, res) => {
    try {
        const { roomId } = req.query;

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }

        const room = await Rooms.findById(roomId).populate('amenities', 'name _id');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).send(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Room
exports.deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.query;

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }

        const room = await Rooms.findByIdAndDelete(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
