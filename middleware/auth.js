const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
    const token = req.header("Authorization")?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' })
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
}

function verifiedRole(roles) {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next() // Role is authorized, proceed to next middleware or controller
        } else {
            res.status(403).json({ message: "Forbidden: You don't have permission to access this." });
        }
    }
}

module.exports = { authenticateUser, verifiedRole };
