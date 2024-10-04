 const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        room: { type: String, required: true },
        roomid: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms', required: true }, // Reference to Rooms
        userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // Reference to Users
        fromdate: { type: String, required: true},
        todate: { type: String, required: true },
        totalamount: { type: Number, required: true },
        totaldays: { type: Number, required: true },
        transactionId: { type: String, required: true },
        status: { type: String, required: true, default: 'booked' }
    },
    { timestamps: true }
);

const Booking = mongoose.model("Bookings", BookingSchema);
module.exports = Booking;

