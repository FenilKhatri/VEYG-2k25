const express = require('express')
const router = express.Router()
const {
  registerGame,
  getUserRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getDayWiseRegistrationStatus,
  checkDayAvailability,
  getDayWiseStats
} = require('../controllers/gameRegistrationController')
const { authenticate, requireAdmin, requireStudent } = require('../middleware/auth')
const { validateDayWiseRegistration, checkMultiDayRegistration } = require('../middleware/dayWiseValidation')

// Student routes
router.post('/register', authenticate, requireStudent, checkMultiDayRegistration, validateDayWiseRegistration, registerGame)
router.get('/my-registrations', authenticate, requireStudent, getUserRegistrations)
router.get('/day-wise-status', authenticate, requireStudent, getDayWiseRegistrationStatus)
router.get('/check-day/:day', authenticate, requireStudent, checkDayAvailability)
router.delete('/:id', authenticate, deleteRegistration)

// Admin routes
router.get('/all', authenticate, requireAdmin, getAllRegistrations)
router.get('/day-wise-stats', authenticate, requireAdmin, getDayWiseStats)
router.patch('/:id/status', authenticate, requireAdmin, updateRegistrationStatus)

module.exports = router
