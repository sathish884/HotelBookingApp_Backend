const express = require("express");
const ratingControllers = require("../controllers/Ratings");
const router = express.Router();

router.route("/rating/create-rating").post(ratingControllers.createRating);

module.exports = router;