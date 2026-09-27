const jwt = require("jsonwebtoken");


// =========================
// AUTH MIDDLEWARE
// =========================

const authMiddleware = (req, res, next) => {

    try {

        // Get token from Authorization header
        const authHeader = req.headers.authorization;


        // Check token exists
        if (!authHeader) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        // Expected format:
        // Authorization: Bearer TOKEN

        const parts = authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({
                message: "Invalid authorization format"
            });

        }


        const token = parts[1];


        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Store user ID in request
        req.userId = decoded.userId;


        // Continue to route
        next();


    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};


module.exports = authMiddleware;
