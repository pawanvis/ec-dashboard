const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        // 1. Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log

        // 3. Attach user to request
        req.user = decoded; // Changed from decoded.user to decoded
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        res.status(401).json({ 
            message: 'Invalid token',
            error: err.message 
        });
    }
};