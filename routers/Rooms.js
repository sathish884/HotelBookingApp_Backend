const express = require("express");
const roomController = require("../controllers/Rooms");
const upload = require("../middleware/multerConFig");

const router = express.Router();

router.route("/createRoom").post(upload("images", 10), roomController.createRooms);
router.route("/updatedRoom").put(upload("images", 10), roomController.updateRoom);
router.route("/getAllRoomList").get(roomController.getAllRoomList);
router.route("/getSingleRoomList").get(roomController.getSingleRoomList);
router.route("/deleteRoom").delete(roomController.deleteRoom);

module.exports = router;