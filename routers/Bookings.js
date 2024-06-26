const express = require("express");
const bookingControllers = require("../controllers/Bookings");
const router = express.Router();

router.route("/booking-room").post(bookingControllers.bookingRooms);

module.exports = router;