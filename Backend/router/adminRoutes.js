const express = require('express')
const router = express.Router()
const { adminRegister, adminLogin, getAdminProfile, updateAdminProfile, changeAdminPassword, getAllRegistrations, updateRegistrationStatus } = require('../controllers/adminController')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { 
  validateAdminRegister, 
  validateAdminLogin, 
  checkValidation 
} = require('../validators/authValidator')

// Admin registration route
router.post('/register', validateAdminRegister, checkValidation, adminRegister)

// Admin login route
router.post('/login', validateAdminLogin, checkValidation, adminLogin)

// Admin profile routes (protected)
router.get('/profile', authenticate, requireAdmin, getAdminProfile)
router.patch('/update-profile', authenticate, requireAdmin, updateAdminProfile)
router.patch('/change-password', authenticate, requireAdmin, changeAdminPassword)

// Admin registration management routes (protected)
router.get('/registrations', authenticate, requireAdmin, getAllRegistrations)
router.patch('/registrations/:id/status', authenticate, requireAdmin, updateRegistrationStatus)

module.exports = router
