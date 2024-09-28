const express = require("express");
const bookingControllers = require("../controllers/Bookings");
const { authenticateUser, verifiedRole } = require("../middleware/auth");
const router = express.Router();

router.route("/booking-room").post(authenticateUser, verifiedRole(["user", "admin"]), bookingControllers.bookingRooms);
router.route("/getBookingRoomsByUser").post(authenticateUser, verifiedRole(["user", "admin"]), bookingControllers.getBookingRooms);
router.route("/cancelbooking").post(authenticateUser, verifiedRole(["user", "admin"]), bookingControllers.cancelBookingRoom);
router.route("/getallbooking").get(authenticateUser, verifiedRole(["user", "admin"]), bookingControllers.getAllBookingRooms);

module.exports = router;