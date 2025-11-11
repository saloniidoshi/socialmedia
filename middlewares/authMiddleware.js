const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({
        status: false,
        data: null,
        message: 'No token provided.',
        error: null,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Check user existence and isDeleted flag
    const user = await User.findById(req.userId);
    if (!user || user.isDeleted || user.accessToken === null) {
      return res.status(403).json({
        status: false,
        data: {},
        message: 'User not found or account deleted.',
        error: {},
      });
    }

    // Proceed to next middleware
    next();

  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({
      status: false,
      data: null,
      message: 'Invalid or expired token.',
      error: err.message,
    });
  }
};
