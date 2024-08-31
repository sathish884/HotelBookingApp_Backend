const Rooms = require("../models/Rooms");
const multer = require('multer');
const path = require('path');


// exports.createHotel = async (req, res) => {
//     try {
//         const { hotelName, amenities, description, address } = req.body;

//         const locations = {
//             lat: parseFloat(req.body['locations.lat']),
//             lang: parseFloat(req.body['locations.lang'])
//         };

//         // Validate locations
//         if (isNaN(locations.lat) || isNaN(locations.lang)) {
//             return res.status(400).json({ message: "Invalid latitude or longitude value." });
//         }

//         // Check if files were uploaded
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ message: "No images uploaded." });
//         }

//         // Extract filenames from file paths
//         const imagePaths = req.files.map(file => path.basename(file.path));

//         // Create a new hotel document
//         const newHotel = new Hotel({
//             hotelName,
//             amenities: amenities ? amenities.split(",") : [],
//             description,
//             address,
//             locations,
//             images: imagePaths
//         });

//         await newHotel.save();
//         console.log('Received request body:', req.body);
//         res.status(201).json({ message: "Hotel Created Successfully", data: newHotel });
//     } catch (error) {
//         console.error(error);
//         if (error instanceof multer.MulterError) {
//             res.status(400).json({ message: error.message });
//         } else {
//             res.status(500).json({ message: error.message });
//         }
//     }
// }
exports.createRoom = async (req, res) => {
    try {
        const { name, amenities, description, rentperday, maxCount, currentbooking, type } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded." });
        }

        const imagePaths = req.files.map(file => path.basename(file.path));

        const newRoom = new Rooms({
            name,
            amenities: amenities ? amenities.split(",") : [],
            description,
            rentperday,
            maxCount,
            currentbooking,
            type,
            imagesurls: imagePaths
        });

        await newRoom.save();
        res.status(201).json({ message: "Hotel Created Successfully", data: newRoom });
    } catch (error) {
        console.error(error.message);
        if (error instanceof multer.MulterError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}


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
        res.status(200).send(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Get Single Room list
exports.getSingleRoom = async (req, res) => {
    try {
        const { roomId } = req.query;

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }

        const room = await Rooms.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).send(room);
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
