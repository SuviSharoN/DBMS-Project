// Backend/Middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    // Get token from header (Authorization: Bearer TOKEN)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Auth middleware: No token provided or malformed header");
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user payload to request object
        req.user = decoded; // req.user will contain { id: '...', role: '...' }
        console.log("Auth middleware: Token verified for user:", req.user.id, "Role:", req.user.role);
        next(); // Proceed to the next middleware or route handler
    } catch (ex) {
        console.error("Auth middleware: Invalid token", ex.message);
        if (ex.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token expired' });
        }
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};

export const adminMiddleware = (req, res, next) => {
    // This middleware MUST run AFTER authMiddleware
    if (req.user && req.user.role === 'Admin') {
        console.log("Admin middleware: Access granted for user:", req.user.id);
        next(); // User is Admin, allow access
    } else {
        console.log("Admin middleware: Forbidden access attempt by user:", req.user?.id, "Role:", req.user?.role);
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
};