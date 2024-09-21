const express = require("express");
const reviewControllers = require("../controllers/Reviews");
const router = express.Router();

router.route("/createReview").post(reviewControllers.createReview);
router.route("/getReviewByHotel").get(reviewControllers.getAllReviewsByHotel);
router.route("/deleteReview").post(reviewControllers.deleteReview);

module.exports = router;