const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

// Validation rules for different routes
const validationRules = {
  // Forgot password validation
  forgotPassword: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail()
  ],
  
  // Reset password validation
  resetPassword: [
    body('token')
      .notEmpty().withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
  ]
};

// Middleware to validate request based on validation type
const validate = (type) => {
  const rules = validationRules[type];
  if (!rules) {
    throw new Error(`No validation rules found for type: ${type}`);
  }

  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      
      // Format errors as an array of error messages
      const errorMessages = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
      
      return errorResponse(res, 400, 'Validation failed', errorMessages);
    }
  ];
};

module.exports = {
  validate,
  validationRules
};
