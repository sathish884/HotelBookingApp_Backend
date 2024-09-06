const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        room: { type: String, required: true },
        roomid: { type: String, required: true },
        userid: { type: String, required: true },
        fromDate: { type: String, required: true },
        toDate: { type: String, required: true },
        totalamount: { type: Number, required: true },
        totaldays: { type: Number, required: true },
        transactionId: { type: String, required: true },
        status: { type: String, require: true, default: 'booked' }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bookings", BookingSchema);


 // hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotels" },
        // room: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
        // user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        // bookingDate: { type: Date },
        // startTime: { type: Date },
        // endTime: { type: Date }