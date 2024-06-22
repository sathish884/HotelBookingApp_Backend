const mongoose = require("mongoose");

const UserShema = new mongoose.Schema(
    {
        userName: { type: String, required: true },
        sureName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        confirmPassword: { type: String, required: true },
        otp: { type: String },
        otpExpiry: { type: Date },
        resetPasswordToken: { type: String },
        resetPasswordTokenExpiry: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Users", UserShema)