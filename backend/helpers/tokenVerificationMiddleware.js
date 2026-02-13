const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ message: 'Access denied, token missing' });
    }

    try {
        // Support both 'Bearer <token>' and direct token formats
        const bearerToken = token.startsWith('Bearer ') ? token.split(" ")[1] : token;

        const verified = jwt.verify(bearerToken, process.env.JWT_SECRET);  // Verify with secret key
        req.user = verified;  // Attach user payload to request
        next();  // Continue to next middleware or route
    }
     catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
