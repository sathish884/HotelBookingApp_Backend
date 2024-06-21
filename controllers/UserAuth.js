const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// User SignUp
exports.signUp = async (req, res) => {
    try {
        const { userName, sureName, email, password, confirmPassword } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            res.status(404).json({ message: "Email already exist" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const hashConfirmPassword = await bcrypt.hash(confirmPassword, 10);
        if (password !== confirmPassword) {
            res.status(400).json({ message: "Password is mismatch" })
        }
        const newUser = new User({
            userName,
            sureName,
            email,
            password: hashPassword,
            confirmPassword: hashConfirmPassword
        });
        await newUser.save();
        res.status(200).json({ message: "Successfully Registered " })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!email) {
            res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).json({ message: "Invalid Credentials" });
        }
        const otp = Math.floor(Math.random() * 10000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000 // OTP expiry in 10m
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sathish001996m@gmail.com",
                pass: "wikblesusrhqhrlh"
            }
        });

        await transporter.sendMail({
            from: "sathish001996m@gmail.com",
            to: user.email,
            subject: "Your OTP code",
            text: `Your otp code is ${otp}`
        })
        res.status(200).json({ message: "OTP is sent to your email", otp });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// verify otp
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expiry otp" });
        }
        // OTP is valid, proceed with login (or issue a JWT, etc.)
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        const jwtToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({ message: "OTP verified successfully", token: jwtToken });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.forgetPassword = async (req, res) => {
    try {

    } catch (error) {

    }
}

