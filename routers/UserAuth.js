const express = require("express");

const router = express.Router();
const userAuth = require("../controllers/UserAuth");

router.route("/registerUser").post(userAuth.register);
router.route('/activate/:token').get(userAuth.activateAccount);
router.route("/login").post(userAuth.login);
router.route("/otp-verify").post(userAuth.verifyOtp);
router.route("/forget-password").post(userAuth.forgotPassword);
router.route("/tokenverify").post(userAuth.forgetPasswordTokenVerify);
router.route("/reset-passsword").post(userAuth.resetPassword);

module.exports = router;