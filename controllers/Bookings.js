// const Booking = require("../models/Booking");
// const Room = require("../models/Rooms");
// require("dotenv").config();
// const stripe = require('stripe')(process.env.STRIPE_KEY);
// const { v4: uuidv4 } = require('uuid');


// exports.bookingRooms = async (req, res) => {
//     const { room, userid, fromdate, todate, totalamount, totaldays, token } = req.body;

//     try {
//         const customer = await stripe.customers.create({
//             email: token.email,
//             source: token.id
//         });

//         const payment = await stripe.charges.create(
//             {
//                 amount: totalamount * 100,
//                 customer: customer.id,
//                 currency: "inr",
//                 receipt_email: token.email
//             },
//             {
//                 idempotencyKey: uuidv4()
//             }
//         );

//         if (payment) {
//             const newbooking = new Booking({
//                 room: room.name,
//                 roomid: room._id,
//                 userid,
//                 fromdate,
//                 todate,
//                 totalamount,
//                 totaldays,
//                 transactionId: '12345'
//             });

//             const savedBooking = await newbooking.save();

//             const roomToUpdate = await Room.findOne({ _id: room._id });

//             roomToUpdate.currentbooking.push({
//                 bookingid: savedBooking._id,
//                 fromdate,
//                 todate,
//                 userid,
//                 status: savedBooking.status
//             });

//             await roomToUpdate.save();
//         }
//         res.status(200).json({ message: 'Payment Successful, your room is booked' })
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }

// }


const Booking = require("../models/Booking");
const Room = require("../models/Rooms");
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require('uuid');

exports.bookingRooms = async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays, token } = req.body;

    // Validate inputs
    if (!room || !userid || !fromdate || !todate || !totalamount || !token) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Stripe customer creation
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        // Stripe payment charge
        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100, // Amount in cents
                customer: customer.id,
                currency: "inr",
                receipt_email: token.email
            },
            {
                idempotencyKey: uuidv4() // Prevent duplicate charges
            }
        );

        if (payment) {
            // Create new booking
            const newbooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid,
                fromdate,
                todate,
                totalamount,
                totaldays,
                transactionId: payment.id // Store actual transaction ID
            });

            const savedBooking = await newbooking.save();

            // Update room availability
            const roomToUpdate = await Room.findOne({ _id: room._id });
            if (roomToUpdate) {
                roomToUpdate.currentbooking.push({
                    bookingid: savedBooking._id,
                    fromdate,
                    todate,
                    userid,
                    status: savedBooking.status
                });

                await roomToUpdate.save();
            }
        }

        res.status(200).json({ message: 'Payment Successful, your room is booked' });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getBookingRooms = async (req, res) => {
    try {
        const { userid } = req.body;

        if (!userid) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch bookings for the user
        const bookings = await Booking.find({ userid });

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        // Return the bookings if found
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error.message); // Log the error message
        res.status(500).json({ message: "Internal Server Error" }); // Generic error message
    }
};

exports.getAllBookingRooms = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" }); // Generic error message
    }
};

exports.cancelBookingRoom = async (req, res) => {
    try {
        const { bookingid, roomid } = req.body;

        const bookingitem = await Booking.findOne({ _id: bookingid });
        bookingitem.status = 'cancelled';
        await bookingitem.save();

        const room = await Room.findOne({ _id: roomid });

        const bookings = room.currentbooking;
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbooking = temp;
        await room.save();
        res.send("Your booking canceled successfully");
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}