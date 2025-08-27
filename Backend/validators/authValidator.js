const { body, validationResult } = require('express-validator')

// Admin registration validation
const validateAdminRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('contactNumber')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Contact number must be a valid 10-digit number'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true
    }),
  
  body('secretKey')
    .equals('veyg_039')
    .withMessage('Invalid admin secret key')
]

// Admin login validation
const validateAdminLogin = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// Student registration validation
const validateStudentRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('contactNumber')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Contact number must be a valid 10-digit number'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

// Student login validation
const validateStudentLogin = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

module.exports = {
  validateAdminRegister,
  validateAdminLogin,
  validateStudentRegister,
  validateStudentLogin,
  checkValidation
}
