const express = require("express");
const reviewControllers = require("../controllers/Reviews");
const { authenticateUser, verifiedRole } = require("../middleware/auth");
const router = express.Router();

// Review
router.route("/createReview").post(reviewControllers.createReview);
router.route("/getReviewByHotel").get(reviewControllers.getAllReviewsByHotel);
router.route("/deleteReview").delete(authenticateUser, verifiedRole(["admin"]), reviewControllers.deleteReview);

// Contact
router.route("/createContact").post(reviewControllers.createContact);
router.route("/getAllContact").get(authenticateUser, verifiedRole(["admin"]), reviewControllers.getAllContacts);
router.route("/deleteContact").delete(authenticateUser, verifiedRole(["admin"]), reviewControllers.deleteContact);


module.exports = router;