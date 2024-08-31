const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// User SignUp
exports.signUp = async (req, res) => {
    try {
        const { name, email, password, confirmpassword } = req.body;

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ message: "Email is already exists" });
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash passwords
        const hashPassword = await bcrypt.hash(password, 10);
       // const hashConfirmPassword = await bcrypt.hash(confirmpassword, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
           // confirmpassword: hashConfirmPassword
           confirmpassword
        });

        // Save new user
        await newUser.save();

        console.log(newUser);
        // Send success response
        return res.status(200).json({ message: "Successfully Registered" });

    } catch (error) {
        // Send error response
        return res.status(500).json({ message: error.message });
    }
}

// login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // const otp = Math.floor(Math.random() * 10000).toString();
        // user.otp = otp;
        // user.otpExpiry = Date.now() + 10 * 60 * 1000 // OTP expiry in 10m
        // await user.save();


        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expiry in 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to: user.email,
            subject: "Your OTP code",
            text: `Your otp code is ${otp}`
        })
        return res.status(200).json({ message: "OTP is sent to your email", otp });
    } catch (error) {
        return res.status(500).json({ message: error.message })
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

        const tempUser = {
            name : user.name,
            email : user.email,
            _id: user._id,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
        }
        // OTP is valid, proceed with login (or issue a JWT, etc.)
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        const jwtToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({ message: "OTP verified successfully", token: jwtToken, data: tempUser });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// Forget Password
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        const resetToken = Math.random().toString(36).slice(-8);
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = Date.now() + 3600000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to: user.email,
            subject: "Password reset request",
            text: `You are receiving this email because you has requested a password reset for your account. \n\ Please use the following token to reset your password: ${resetToken} \n\n If you didn't request a password reset, please ignore this email.`
        })
        return res.status(200).json({ message: "Token is sented to your email" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Verify the reset password token
exports.forgetPasswordTokenVerify = async (req, res) => {
    try {
        const { email, token } = req.body;
        const user = await User.findOne({ email });
        if (user.resetPasswordToken !== token || user.resetPasswordTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expiry OTP" })
        }
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiry = null;
        await user.save();
        res.status(200).json({ message: "Verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Reset Password 
exports.resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const user = await User.findOne({ email });
        if (password !== confirmPassword) {
            res.status(400).json({ message: "Password are Mismatched" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
        user.password = hashedPassword;
        user.confirmPassword = hashedConfirmPassword;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to: user.email,
            subject: "Password Reset",
            text: `You Password reset successfully.`
        })
        res.status(200).json({ message: "Password Reset Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

