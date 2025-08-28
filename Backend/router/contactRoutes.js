const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

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

            // Create transporter (using Gmail SMTP)
            const transporter = nodemailer.createTransporter({
                  service: 'gmail',
                  auth: {
                        user: process.env.EMAIL_USER || 'veyg.notification@gmail.com',
                        pass: process.env.EMAIL_PASS || 'your-app-password' // Use app password for Gmail
                  }
            })

            // Email content
            const mailOptions = {
                  from: email,
                  to: 'veyg.notification@gmail.com',
                  subject: `VEYG 2K25 Contact Form - Message from ${username}`,
                  html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${username}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            This message was sent from the VEYG 2K25 contact form.
          </p>
        </div>
      `
            }

            // Send email
            await transporter.sendMail(mailOptions)

            res.status(200).json({
                  success: true,
                  message: 'Message sent successfully!'
            })

      } catch (error) {
            console.error('Contact form error:', error)
            res.status(500).json({
                  success: false,
                  message: 'Failed to send message. Please try again later.'
            })
      }
})

module.exports = router