const moment = require("moment");
const Booking = require("../models/Booking");
const { Rooms } = require("../models/Rooms"); // Import Rooms model correctly
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

exports.bookingRooms = async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays, token } = req.body;

    try {

        // Convert fromdate and todate to ISO format (YYYY-MM-DD)
        const fromDate = moment(fromdate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const toDate = moment(todate, 'DD-MM-YYYY').format('YYYY-MM-DD');

        if (!moment(fromDate).isValid() || !moment(toDate).isValid()) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const payment = await stripe.charges.create({
            amount: totalamount * 100,
            customer: customer.id,
            currency: "inr",
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        });

        if (payment) {
            const newBooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid,
                fromdate: fromDate,
                todate: toDate,
                totalamount,
                totaldays,
                transactionId: "1234"
            });

            const savedBooking = await newBooking.save();

            const roomToUpdate = await Rooms.findOne({ _id: room._id }); // Ensure you are using the correct model

            if (roomToUpdate) {
                roomToUpdate.currentbooking.push({
                    bookingid: savedBooking._id,
                    fromdate:fromDate,
                    todate:toDate,
                    userid: userid,
                    status: savedBooking.status
                });

                await roomToUpdate.save();
            } else {
                throw new Error("Room not found for updating current bookings.");
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

        const room = await Rooms.findOne({ _id: roomid });

        const bookings = room.currentbooking;
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbooking = temp;
        await room.save();
        res.send("Your booking canceled successfully");
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}