const express = require("express");
const hotelController = require("../controllers/Hotels");
const uploads = require("../middleware/multerConFig"); // Ensure this path is correct
//const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Route with file upload and auth middleware
router.route("/createHotel").post(uploads.upload, hotelController.createHotel);

// Other routes with appropriate middlewares
router.route("/updateHotel").put(uploads.upload, hotelController.updateHotel);

router.route("/getAllHotelList").get(hotelController.getAllHotelList);
router.route("/getSingleHotelList").get(hotelController.getSingleHotelList);
router.route("/deleteHotel").delete(hotelController.deleteHotel);

module.exports = router;
