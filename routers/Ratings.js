const express = require("express");
const ratingControllers = require("../controllers/Ratings");
const router = express.Router();

router.route("/createReview").post(ratingControllers.createRating);

module.exports = router;