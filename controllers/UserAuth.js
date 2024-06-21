const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        const newUser = new User({
            userName,
            sureName,
            email,
            password: hashPassword,
            confirmPassword: hashConfirmPassword
        });
        await newUser.save();
        res.status(200).json({ message: "User registered successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}