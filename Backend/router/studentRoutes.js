const express = require('express')
const router = express.Router()
const { studentRegister, studentLogin, getStudentProfile, updateStudentProfile } = require('../controllers/studentController')
const { authenticate, requireStudent } = require('../middleware/auth')
const { 
  validateStudentRegister, 
  validateStudentLogin, 
  checkValidation 
} = require('../validators/authValidator')

// Student registration route
router.post('/register', validateStudentRegister, checkValidation, studentRegister)

// Student login route
router.post('/login', validateStudentLogin, checkValidation, studentLogin)

// Student profile routes (protected)
router.get('/profile', authenticate, requireStudent, getStudentProfile)
router.patch('/profile', authenticate, requireStudent, updateStudentProfile)

module.exports = router
