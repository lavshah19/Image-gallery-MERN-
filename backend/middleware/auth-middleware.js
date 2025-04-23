require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const jwt = require("jsonwebtoken");
    const authHeader = req.headers["authorization"];
    // console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Please login to continue"
        });
    }

    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decodedTokenInfo);
        req.userInfo = decodedTokenInfo;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again."
        });
    }
};

module.exports = authMiddleware;
