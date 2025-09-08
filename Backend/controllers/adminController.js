const Admin = require('../models/Admin')
const GameRegistration = require('../models/GameRegistration')
const { generateToken } = require('../middleware/auth')
const nodemailer = require('nodemailer')
const { sendPaymentConfirmationEmail } = require('../sendMail')
const websocketService = require('../services/websocket')

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Admin Registration
const adminRegister = async (req, res) => {
  try {
    const { name, contactNumber, email, password, secretKey } = req.body

    // Check if admin already exists with this email
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists' })
    }

    // Create new admin
    const admin = new Admin({
      name,
      contactNumber,
      email,
      password
    })

    await admin.save()

    console.log('✅ Admin registration completed successfully')

    // Send registration confirmation email with plain password
    try {
      await sendAdminRegistrationEmail(admin, password) // Send original plain password
      console.log('✅ Admin registration email sent successfully')
    } catch (emailError) {
      console.error('❌ Failed to send admin registration email:', emailError)
      // Don't fail registration if email fails
    }

    // Generate token
    const token = generateToken({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    })

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    })
  } catch (error) {
    console.error('Admin registration error:', error)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }
    res.status(500).json({ success: false, message: 'Server error during admin registration' })
  }
}

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+password')
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    })

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ success: false, message: 'Server error during admin login' })
  }
}

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id)
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Get admin profile error:', error)
    res.status(500).json({ success: false, message: 'Server error while fetching admin profile' })
  }
}

// Update Admin Profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    
    const updateData = {}
    if (name && name.trim() !== '') {
      updateData.name = name.trim()
    }
    if (email && email.trim() !== '') {
      updateData.email = email.trim()
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' })
    }

    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Update admin profile error:', error)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }
    res.status(500).json({ success: false, message: 'Server error while updating profile' })
  }
}

// Change Admin Password
const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' })
    }

    const admin = await Admin.findById(req.user.id).select('+password')
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' })
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    res.status(200).json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change admin password error:', error)
    res.status(500).json({ success: false, message: 'Server error while changing password' })
  }
}

// Get All Registrations (Admin only)
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await GameRegistration.find()
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, message: 'Registrations retrieved successfully', data: { registrations } })
  } catch (error) {
    console.error('Get all registrations error:', error)
    res.status(500).json({ success: false, message: 'Server error while fetching registrations' })
  }
}

// Update Registration Status (Admin only)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { approvalStatus } = req.body

    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status. Must be approved, rejected, or pending' })
    }

    // Get admin info for tracking who approved
    const admin = await Admin.findById(req.user.id)
    const approvedBy = approvalStatus === 'approved' ? admin?.name || 'Admin' : null

    const registration = await GameRegistration.findByIdAndUpdate(
      id,
      { 
        approvalStatus: approvalStatus,
        approvedBy: approvedBy,
        approvedAt: approvalStatus === 'approved' ? new Date() : null
      },
      { new: true }
    )

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' })
    }

    // Send payment confirmation email if status is approved
    if (approvalStatus === 'approved') {
      try {
        // Update payment status to paid when approved
        registration.paymentStatus = 'paid';
        await registration.save();
        
        // Send payment confirmation email using the new system
        await sendPaymentConfirmationEmail(registration);
        
        console.log('✅ Payment confirmation email sent for registration:', registration.registrationId);
      } catch (emailError) {
        console.error('❌ Failed to send payment confirmation email:', emailError);
        // Don't fail the approval process if email fails
      }
    }

    // Emit real-time payment status update via WebSocket
    try {
      websocketService.emitPaymentStatusUpdate(registration.userId, registration);
    } catch (wsError) {
      console.warn('Failed to emit payment status update:', wsError.message);
    }

    res.status(200).json({ success: true, message: 'Approval status updated successfully', data: { registration } })
  } catch (error) {
    console.error('Update approval status error:', error)
    res.status(500).json({ success: false, message: 'Server error while updating approval status' })
  }
}


module.exports = {
  adminRegister,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllRegistrations,
  updateRegistrationStatus,
}
