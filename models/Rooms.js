const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        bed: { type: String, required: true },
        amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenities' }], // Reference to Amenities
        description: { type: String, required: true },
        rentperday: { type: Number, required: true },
        maxCount: { type: Number, required: true },
        imagesurls: [{ type: String }], // Define as an array of strings
        currentbooking: [{
            bookingid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings' }, // Reference to Booking
            fromdate: { type: Date, required: true },
            todate: { type: Date, required: true },
            userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // Reference to Users
            status: { type: String, default: 'booked' }
        }],
        type: { type: String, required: true },
    },
    { timestamps: true }
);

const AmenitiesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }
    },
    { timestamps: true }
);

const Rooms = mongoose.model("Rooms", RoomSchema);
const Amenities = mongoose.model("Amenities", AmenitiesSchema);

module.exports = { Rooms, Amenities };
