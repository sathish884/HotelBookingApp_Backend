const express = require("express");
const mongoose = require("mongoose")

const router = express.Router();
const User = require("../controllers/UserAuth");

router.route("/signup").post(User.signUp);
router.route("/login").post(User.login);
router.route("/otp-verify").post(User.verifyOtp);
router.route("/forget-password").post(User.forgetPassword);
router.route("/forgetpassword-tokenverify").post(User.forgetPasswordTokenVerify);
router.route("/reset-passsword").post(User.resetPassword);

module.exports = router;