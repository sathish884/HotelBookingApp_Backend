const express = require("express");
const roomController = require("../controllers/Rooms");
const { authenticateUser, verifiedRole } = require("../middleware/auth");
const router = express.Router();


// Route with file upload and auth middleware
router.route("/createroom").post(authenticateUser, verifiedRole(["admin"]), roomController.createRoom);

// Other routes with appropriate middlewares
router.route("/updateRoom").put(authenticateUser, verifiedRole(["admin"]), roomController.updateRoom);

router.route("/getAllRoomList").get(roomController.getAllRoomList);
router.route("/getSingleRoom").get(roomController.getSingleRoom);
router.route("/deleteRoom").delete(authenticateUser, verifiedRole(["admin"]), roomController.deleteRoom);

// Amenities
router.route("/create-amenities").post(authenticateUser, verifiedRole(["admin"]), roomController.createAmenities);
router.route("/getAllAmenities").get(authenticateUser, verifiedRole(["admin"]), roomController.getAllAmenities);

module.exports = router;