const Booking = require("../models/Booking");
const Room = require("../models/Rooms")

// // Booking rooms
// exports.bookingRooms = async (req, res) => {
//     try {
//         const { hotelId, roomId, userId, bookingDate, startTime, endTime } = req.body;

//         const parseBookingDate = new Date(bookingDate);
//         const parseStartTime = new Date(startTime);
//         const parseEndTime = new Date(endTime);

//         if (isNaN(parseBookingDate) || isNaN(parseStartTime.getTime()) || isNaN(parseEndTime.getTime())) {
//             res.status(400).json({ message: "Invalid Date format" })
//         }

//         const exisitingBookingRooms = await Bookings.find({
//             room: { $in: roomId },
//             $or: [
//                 { startTime: { $lt: parseEndTime }, endTime: { $gt: parseStartTime } },
//                 { startTime: { $lt: parseStartTime }, endTime: { $gt: parseStartTime } },
//                 { startTime: { $lt: parseEndTime }, endTime: { $gt: parseEndTime } }
//             ]
//         });

//         if (exisitingBookingRooms) {
//             res.status(404).json({ message: "This Room is already booked for the selected time period. Pls book other time" })
//         }

//         const newBookingRooms = new Bookings({
//             hotel: hotelId,
//             room: roomId,
//             user: userId,
//             bookingDate: parseBookingDate,
//             startTime: parseStartTime,
//             endTime: parseEndTime
//         });

//         await newBookingRooms.save();
//         res.status(200).json({ message: "Successfully Booked" })
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }

exports.bookingRooms = async (req, res) => {
    const { room, userid, fromDate, toDate, totalamount, totaldays } = req.body;

    try {

        const newbooking = new Booking({
            room: room.name,
            roomid: room._id,
            userid,
            fromDate,
            toDate,
            totalamount,
            totaldays,
            transactionId: '12345'
        });

        const savedBooking  = await newbooking.save();

        const roomToUpdate  = await Room.findOne({_id:room._id});

        roomToUpdate.currentbooking.push({
            bookingid: savedBooking._id,
            fromDate,
            toDate,
            userid,
            status: savedBooking.status
        });

        await roomToUpdate.save();

        res.status(200).json({ message: 'Room booked successfully' })

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}