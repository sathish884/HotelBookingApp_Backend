const express = require("express");
const hotelController = require("../controllers/Hotels");
const upload = require("../middleware/multerConFig");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.route("/createHotel").post(upload.array("images", 10), authMiddleware, hotelController.createHotel);
router.route("/updateHotel").put(upload.array("images", 10), hotelController.updateHotel);
router.route("/getAllHotelList").get(hotelController.getAllHotelList);
router.route("/getSingleHotelList").get(hotelController.getSingleHotelList);
router.route("/deleteHotel").delete(hotelController.deleteHotel);

module.exports = router;
