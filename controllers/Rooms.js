const Rooms = require("../models/Rooms");

exports.createRooms = async (req, res) => {
    try {
        const { roomName, amenities, price, sharingCount, descriptions } = req.body;

        const imagePaths = req.files.map(file => file.path);
        const newRoom = new Rooms({
            roomName,
            amenities,
            price,
            sharingCount,
            descriptions,
            images: imagePaths
        });

        await newRoom.save();
        res.status(200).json({ message: "Room Successflly created" });
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
};

// Update Rooms
exports.updateRoom = async (req, res) => {
    try {
        const roomId = req.query;
        const { roomName, amenities, price, sharingCount, descriptions } = req.body;

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }

        const updateData = {
            roomName,
            amenities: amenities ? amenities.split(",") : [],
            price,
            sharingCount,
            descriptions
        };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        }

        const newRoom = await Rooms.findByIdAndUpdate(
            roomId,
            updateData,
            { new: true, runValidators: true }
        );
       return res.status(200).json({ message: "Room Updated successfully", data: newRoom });
    } catch (error) {
       return res.status(500).json({ message: error.message })
    }
};

// Get All Rooms list
exports.getAllRoomList = async (req, res) => {
    try {
        const rooms = await Rooms.find({});
        res.status(200).json({ data: rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Get Single Room list
exports.getSingleRoomList = async (req, res) => {
    try {
        const { roomId } = req.query;

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }

        const room = await Rooms.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({ data: room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
