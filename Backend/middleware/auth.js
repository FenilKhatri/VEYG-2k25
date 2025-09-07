const { verifyToken } = require('../utils/auth')
const { Admin, Student } = require('../models')
const { errorResponse } = require('../utils/response')

// Authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token')
    
    console.log('Auth middleware - Token present:', !!token);
    
    if (!token) {
      return errorResponse(res, 401, 'Access denied. No token provided.')
    }

    const decoded = verifyToken(token)
    console.log('Auth middleware - Decoded user:', decoded);
    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 401, 'Invalid token.')
  }
}

// Check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Access denied. Admin privileges required.')
    }
    next()
  } catch (error) {
    return errorResponse(res, 500, 'Server error in admin check.')
  }
}

// Check if user is student
const requireStudent = async (req, res, next) => {
  try {
    console.log('Student auth check - User:', req.user);
    if (!req.user) {
      return errorResponse(res, 401, 'Access denied. Authentication required.')
    }
    if (req.user.role !== 'student') {
      return errorResponse(res, 403, `Access denied. Student privileges required. Current role: ${req.user.role}`)
    }
    next()
  } catch (error) {
    console.error('Student auth error:', error);
    return errorResponse(res, 500, 'Server error in student check.')
  }
}

module.exports = {
  authenticate,
  requireAdmin,
  requireStudent
}
