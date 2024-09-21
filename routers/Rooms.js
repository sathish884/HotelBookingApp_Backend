const express = require("express");
const roomController = require("../controllers/Rooms");
const uploads = require("../middleware/multerConFig"); // Ensure this path is correct
const router = express.Router();


// Route with file upload and auth middleware
router.route("/createroom").post(uploads.upload, roomController.createRoom);

// Other routes with appropriate middlewares
router.route("/updateRoom").put(uploads.upload, roomController.updateRoom);

router.route("/getAllRoomList").get(roomController.getAllRoomList);
router.route("/getSingleRoom").get(roomController.getSingleRoom);
router.route("/deleteRoom").delete(roomController.deleteRoom);

// Amenities
router.route("/create-amenities").post(roomController.createAmenities);
router.route("/getAllAmenities").get(roomController.getAllAmenities);

module.exports = router;