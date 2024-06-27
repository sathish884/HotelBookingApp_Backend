const Bookings = require("../models/Booking");

// Booking rooms
exports.bookingRooms = async (req, res) => {
    try {
        const { hotelId, roomId, userId, bookingDate, startTime, endTime } = req.body;

        const parseBookingDate = new Date(bookingDate);
        const parseStartTime = new Date(startTime);
        const parseEndTime = new Date(endTime);

        if (isNaN(parseBookingDate) || isNaN(parseStartTime.getTime()) || isNaN(parseEndTime.getTime())) {
            res.status(400).json({ message: "Invalid Date format" })
        }

        const exisitingBookingRooms = await Bookings.find({
            room: { $in: roomId },
            $or: [
                { startTime: { $lt: parseEndTime }, endTime: { $gt: parseStartTime } },
                { startTime: { $lt: parseStartTime }, endTime: { $gt: parseStartTime } },
                { startTime: { $lt: parseEndTime }, endTime: { $gt: parseEndTime } }
            ]
        });

        if (exisitingBookingRooms) {
            res.status(404).json({ message: "This Room is already booked for the selected time period. Pls book other time" })
        }

        const newBookingRooms = new Bookings({
            hotel: hotelId,
            room: roomId,
            user: userId,
            bookingDate: parseBookingDate,
            startTime: parseStartTime,
            endTime: parseEndTime
        });

        await newBookingRooms.save();
        res.status(200).json({ message: "Successfully Booked" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}