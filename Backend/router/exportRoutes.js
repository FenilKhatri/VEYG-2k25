const express = require('express')
const router = express.Router()
const { 
  exportStudents, 
  exportGames, 
  exportAllRegistrations 
} = require('../controllers/exportController')
const { authenticate, requireAdmin } = require('../middleware/auth')

// All export routes require admin authentication
router.get('/students', authenticate, requireAdmin, exportStudents)
router.get('/game-registrations', authenticate, requireAdmin, exportGames)
router.get('/all', authenticate, requireAdmin, exportAllRegistrations)

module.exports = router
