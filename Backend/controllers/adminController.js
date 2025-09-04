const { Admin, GameRegistration } = require('../models')
const { generateToken } = require('../utils/jwt')
const { successResponse, errorResponse } = require('../utils/response')

// Admin Registration
const adminRegister = async (req, res) => {
  try {
    const { name, contactNumber, email, password, secretKey } = req.body

    // Check if admin already exists with this email
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return errorResponse(res, 400, 'Admin with this email already exists')
    }

    // Create new admin
    const admin = new Admin({
      name,
      contactNumber,
      email,
      password
    })

    await admin.save()

    // Generate token
    const token = generateToken({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isAdmin: admin.isAdmin
    })

    successResponse(res, 201, 'Admin registered successfully', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        contactNumber: admin.contactNumber,
        role: admin.role,
        isAdmin: admin.isAdmin
      }
    })
  } catch (error) {
    console.error('Admin registration error:', error)
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Email already exists')
    }
    errorResponse(res, 500, 'Server error during admin registration')
  }
}

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+password')
    if (!admin) {
      return errorResponse(res, 401, 'Invalid credentials')
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid credentials')
    }

    // Generate token
    const token = generateToken({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isAdmin: admin.isAdmin
    })

    successResponse(res, 200, 'Admin login successful', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        contactNumber: admin.contactNumber,
        role: admin.role,
        isAdmin: admin.isAdmin
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    errorResponse(res, 500, 'Server error during admin login')
  }
}

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id)
    if (!admin) {
      return errorResponse(res, 404, 'Admin not found')
    }

    successResponse(res, 200, 'Admin profile retrieved successfully', {
      name: admin.name,
      email: admin.email,
      role: admin.role
    })
  } catch (error) {
    console.error('Get admin profile error:', error)
    errorResponse(res, 500, 'Server error while fetching admin profile')
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
      return errorResponse(res, 400, 'No valid fields to update')
    }

    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!admin) {
      return errorResponse(res, 404, 'Admin not found')
    }

    successResponse(res, 200, 'Profile updated successfully', {
      name: admin.name,
      email: admin.email,
      role: admin.role
    })
  } catch (error) {
    console.error('Update admin profile error:', error)
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Email already exists')
    }
    errorResponse(res, 500, 'Server error while updating profile')
  }
}

// Change Admin Password
const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return errorResponse(res, 400, 'Current password and new password are required')
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 400, 'New password must be at least 6 characters long')
    }

    const admin = await Admin.findById(req.user.id).select('+password')
    if (!admin) {
      return errorResponse(res, 404, 'Admin not found')
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return errorResponse(res, 401, 'Current password is incorrect')
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    successResponse(res, 200, 'Password changed successfully')
  } catch (error) {
    console.error('Change admin password error:', error)
    errorResponse(res, 500, 'Server error while changing password')
  }
}

// Get All Registrations (Admin only)
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await GameRegistration.find()
      .sort({ createdAt: -1 })

    successResponse(res, 200, 'Registrations retrieved successfully', { registrations })
  } catch (error) {
    console.error('Get all registrations error:', error)
    errorResponse(res, 500, 'Server error while fetching registrations')
  }
}

// Update Registration Status (Admin only)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { approvalStatus } = req.body

    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return errorResponse(res, 400, 'Invalid approval status. Must be approved, rejected, or pending')
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
      return errorResponse(res, 404, 'Registration not found')
    }

    // Send payment approval email if status is approved
    if (approvalStatus === 'approved') {
      try {
        // Prepare participant data
        const participantData = {
          name: registration.teamLeader?.fullName || 'Participant',
          email: registration.teamLeader?.email || '',
          contact: registration.teamLeader?.contactNumber || '',
          college: registration.teamLeader?.collegeName || ''
        };

        // Prepare game data
        const gameData = {
          gameName: registration.gameName || 'Game',
          registrationType: registration.registrationType || 'Individual',
          registrationFee: registration.totalAmount || 0,
          baseFee: registration.totalAmount || 0,
          teamMembers: registration.teamMembers || [],
          teamLeader: registration.teamLeader?.fullName || 'Team Leader',
          paymentStatus: 'confirmed'
        };

        // Prepare registration data
        const registrationData = {
          registrationId: registration.registrationId || registration._id,
          receiptNumber: registration.registrationId || registration._id
        };

        // Send payment approval email - temporarily disabled
        // await sendPaymentApprovalEmail(registration);
        
        console.log('✅ Payment approval status updated for registration:', registration.registrationId);
      } catch (emailError) {
        console.error('❌ Failed to send payment approval email:', emailError);
        // Don't fail the approval process if email fails
      }
    }

    successResponse(res, 200, 'Approval status updated successfully', { registration })
  } catch (error) {
    console.error('Update approval status error:', error)
    errorResponse(res, 500, 'Server error while updating approval status')
  }
}

module.exports = {
  adminRegister,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllRegistrations,
  updateRegistrationStatus
}
