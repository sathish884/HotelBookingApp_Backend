const express = require("express");
const reviewControllers = require("../controllers/Reviews");
const router = express.Router();

router.route("/createReview").post(reviewControllers.createReview);
router.route("/updateReview").post(reviewControllers.updateReview);
router.route("/getReviewByHotel").get(reviewControllers.getReviewsByHotel);
router.route("/deleteReview").post(reviewControllers.deleteReview);