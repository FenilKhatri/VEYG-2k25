const express = require('express')
const router = express.Router()

// Contact form submission route
router.post('/contact', async (req, res) => {
      try {
            const { username, email, message } = req.body

            // Validate required fields
            if (!username || !email || !message) {
                  return res.status(400).json({
                        success: false,
                        message: 'All fields are required'
                  })
            }

            // Log the contact form submission (since email is removed)
            console.log('📧 Contact form submission received:')
            console.log(`Name: ${username}`)
            console.log(`Email: ${email}`)
            console.log(`Message: ${message}`)

            res.status(200).json({
                  success: true,
                  message: 'Message received successfully! We will get back to you soon.'
            })

      } catch (error) {
            console.error('Contact form error:', error)
            res.status(500).json({
                  success: false,
                  message: 'Failed to process message. Please try again later.'
            })
      }
})

module.exports = router