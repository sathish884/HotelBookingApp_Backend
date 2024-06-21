const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotels" },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        bookingDate: { type: Date },
        startTime: { type: Date },
        endTime: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bookings", BookingSchema);