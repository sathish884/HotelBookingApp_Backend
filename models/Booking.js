const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        room: { type: String, required: true },
        roomid: { type: String, required: true },
        userid: { type: String, required: true },
        fromdate: { type: String, required: true },
        todate: { type: String, required: true },
        totalamount: { type: Number, required: true },
        totaldays: { type: Number, required: true },
        transactionId: { type: String, required: true },
        status: { type: String, require: true, default: 'booked' }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bookings", BookingSchema);
