const express = require("express");
const bookingControllers = require("../controllers/Bookings");
const router = express.Router();

router.route("/booking-room").post(bookingControllers.bookingRooms);
router.route("/getBookingRoomsByUser").post(bookingControllers.getBookingRooms);
router.route("/cancelbooking").post(bookingControllers.cancelBookingRoom);
router.route("/getallbooking").get(bookingControllers.getAllBookingRooms);

module.exports = router;