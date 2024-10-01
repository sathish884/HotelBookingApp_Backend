const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// User SignUp
exports.register = async (req, res) => {
    try {
        const { name, email, mobilenumber, password, confirmPassword } = req.body;

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ message: "Email already exists" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);
        const hashConfirmPassword = await bcrypt.hash(confirmPassword, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            mobilenumber,
            role: 'user',
            password: hashPassword,
            confirmPassword: hashConfirmPassword
        });

        await newUser.save();

        // Generate activation token
        const activationToken = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        const activationURL = `${process.env.CLIENT_URL}/activate/${activationToken}`;

        // Configure transporter for nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send activation email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: newUser.email, // Use newUser.email here
            subject: "Account Activation",
            text: `Please activate your account by clicking the following link: \n${activationURL}`,
        });

        res.status(201).json({ message: 'User registered successfully. Check your email to activate your account.', token: activationToken });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// User activation
exports.activateAccount = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        user.isActive = true;
        await user.save();

        res.status(200).json({ message: 'Account activated. You can now log in.' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// User login
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

        if (user.isActive != true) {
            return res.status(400).json({ message: "Please active the account" });
        }

        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expiry in 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your OTP code",
            text: `Your otp code is ${otp}`
        })
        return res.status(200).json({ message: "OTP is sent to your email", otp });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Verify otp
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expiry otp" });
        }

        // OTP is valid, proceed with login (or issue a JWT, etc.)
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        const tempUser = {
            name: user.name,
            email: user.email,
            mobilenumber: user.mobilenumber,
            role: user.role,
            _id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        const jwtToken = jwt.sign({ userId: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({ message: "OTP verified successfully", token: jwtToken, data: tempUser });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            algorithm: 'HS256', // Using HS384 for potentially shorter token
            expiresIn: '5m',   // 5 minutes expiration
        });

        user.resetPasswordToken = resetToken;

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const msg = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `You are receiving this email because you have requested a password reset for your account. \n\nPlease use the following token to reset your password: \n\n${resetToken} \n\nIf you didn't request a password reset, please ignore this email.`
        };

        await transporter.sendMail(msg);

        res.status(200).json({ message: 'Password reset email sent', token: resetToken });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



// Token verify
exports.forgetPasswordTokenVerify = async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        await user.save();

        res.status(200).json({ message: 'Token verified successful' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

        // Update user's password and reset token
        user.password = hashedPassword;
        user.confirmPassword = hashedConfirmPassword;
        user.resetPasswordToken = null;  // Clear the reset token

        // Save the updated user
        await user.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Successful",
            text: `Your password has been successfully reset.`
        });

        res.status(200).json({ message: "Your password has been successfully reset." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}); // Retrieve all users
        const tempUsers = users.map(user => ({
            name: user.name,
            email: user.email,
            mobilenumber: user.mobilenumber,
            _id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })); // Map over the users to extract necessary fields

        res.json(tempUsers); // Send the array of user objects
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

