const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    const token = req.header("Authorization")?.replace('Bearer ', '');
    if(!token){
        return res.status(401).json({message:'No token, authorization denied'})
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = verified.userId;
        next();
    } catch (error) {
        res.status(400).json({message:"Invalid Token"});
    }
}