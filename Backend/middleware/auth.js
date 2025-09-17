const { verifyToken } = require('../utils/auth')
const { Admin, Student } = require('../models')
const { errorResponse } = require('../utils/response')

// Authenticate JWT token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  next()
}

// Check if user is student
const requireStudent = async (req, res, next) => {
  try {
    if (!req.user) {
      return errorResponse(res, 401, 'Access denied. Authentication required.')
    }
    if (req.user.role !== 'student') {
      return errorResponse(res, 403, 'Access denied. Student privileges required.')
    }
    next()
  } catch (error) {
    return errorResponse(res, 500, 'Server error in student check.')
  }
}

module.exports = {
  authenticate,
  requireAdmin,
  requireStudent
}
