const express = require("express");
const hotelController = require("../controllers/Hotels");
const router = express.Router();

// Route with file upload and auth middleware
router.route("/createHotel").post(hotelController.createHotel);

// Other routes with appropriate middlewares
router.route("/updateHotel").put(hotelController.updateHotel);

router.route("/getAllHotelList").get(hotelController.getAllHotelList);
router.route("/getSingleHotelList").get(hotelController.getSingleHotelList);
router.route("/deleteHotel").delete(hotelController.deleteHotel);

module.exports = router;
