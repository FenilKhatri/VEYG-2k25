const express = require('express')
const router = express.Router()
const { adminRegister, adminLogin, getAdminProfile, updateAdminProfile, changeAdminPassword, getAllRegistrations, updateRegistrationStatus, retrySheetSync } = require('../controllers/adminController')
const { authenticate, requireAdmin } = require('../middleware/auth')

// Admin Registration Routes (both endpoints work)
router.post('/register', adminRegister)
router.post('/signup', adminRegister)

// Admin Login Route
router.post('/login', adminLogin)

// GET handlers for helpful error messages
router.get('/login', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Method Not Allowed. This endpoint requires POST method.',
    expectedMethod: 'POST',
    expectedPayload: {
      email: 'admin@example.com',
      password: 'your_password'
    },
    endpoint: '/api/admin/login'
  })
})

router.get('/signup', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Method Not Allowed. This endpoint requires POST method.',
    expectedMethod: 'POST',
    expectedPayload: {
      name: 'Admin Name',
      email: 'admin@example.com',
      contactNumber: '1234567890',
      password: 'your_password',
      confirmPassword: 'your_password',
      secretKey: 'veyg_039'
    },
    endpoint: '/api/admin/signup'
  })
})

router.get('/register', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Method Not Allowed. This endpoint requires POST method.',
    expectedMethod: 'POST',
    expectedPayload: {
      name: 'Admin Name',
      email: 'admin@example.com',
      contactNumber: '1234567890',
      password: 'your_password',
      confirmPassword: 'your_password',
      secretKey: 'veyg_039'
    },
    endpoint: '/api/admin/register'
  })
})

// Protected routes
router.get('/profile', authenticate, requireAdmin, getAdminProfile)
router.patch('/update-profile', authenticate, requireAdmin, updateAdminProfile)
router.patch('/change-password', authenticate, requireAdmin, changeAdminPassword)
router.get('/registrations', authenticate, requireAdmin, getAllRegistrations)
router.patch('/registrations/:id/status', authenticate, requireAdmin, updateRegistrationStatus)
router.post('/registrations/:id/retry-sync', authenticate, requireAdmin, retrySheetSync)

module.exports = router
