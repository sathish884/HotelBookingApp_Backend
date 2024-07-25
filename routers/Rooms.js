const express = require("express");
const roomController = require("../controllers/Rooms");
const uploads = require("../middleware/multerConFig"); // Ensure this path is correct

const router = express.Router();


// Route with file upload and auth middleware
router.route("/createHotel").post(uploads.upload, roomController.createRooms);

// Other routes with appropriate middlewares
router.route("/updateHotel").put(uploads.upload, roomController.updateRoom);

router.route("/getAllRoomList").get(roomController.getAllRoomList);
router.route("/getSingleRoomList").get(roomController.getSingleRoomList);
router.route("/deleteRoom").delete(roomController.deleteRoom);

module.exports = router;