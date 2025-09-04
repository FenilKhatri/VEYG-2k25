const express = require('express')
const router = express.Router()

// Import route modules
const adminRoutes = require('./adminRoutes')
const studentRoutes = require('./studentRoutes')
const gameRegistrationRoutes = require('./gameRegistrationRoutes')
const contactRoutes = require('./contactRoutes')
// Health check route
router.get('/health', (req, res) => {
      res.json({
            success: true,
            message: 'VEYG Backend API is running!',
            timestamp: new Date().toISOString()
      })
})

// Use routes
router.use('/admin', adminRoutes)
router.use('/student', studentRoutes)
router.use('/user', studentRoutes) // Add user alias for student routes
router.use('/game-registrations', gameRegistrationRoutes)
router.use('/form', contactRoutes)

module.exports = router
