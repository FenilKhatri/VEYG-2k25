const express = require('express')
const router = express.Router()
const { submitContactForm, getAllContacts, updateContactStatus } = require('../controllers/contactController')
const { authenticate, requireAdmin } = require('../middleware/auth')

// Public route - Contact form submission
router.post('/contact', submitContactForm)

// Admin routes - Contact management
router.get('/contacts', authenticate, requireAdmin, getAllContacts)
router.put('/contacts/:id', authenticate, requireAdmin, updateContactStatus)

module.exports = router