const { Admin, GameRegistration } = require('../models')
const { generateToken } = require('../utils/jwt')
const { successResponse, errorResponse } = require('../utils/response')
const { sendPaymentConfirmationEmail } = require('../sendMail')
const websocketService = require('../services/websocket')

// Admin Registration - Completely New Implementation
const adminRegister = async (req, res) => {
  try {
    console.log('🔥 NEW Admin Registration Request:', req.body);
    
    const { name, contactNumber, email, password, confirmPassword, secretKey } = req.body;

    // Comprehensive validation
    if (!name || !contactNumber || !email || !password || !confirmPassword || !secretKey) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, contactNumber, email, password, confirmPassword, secretKey'
      });
    }

    // Validate secret key
    if (secretKey !== 'veyg_039') {
      console.log('❌ Invalid secret key');
      return res.status(400).json({
        success: false,
        message: 'Invalid admin secret key provided'
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      console.log('❌ Password too weak');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate contact number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      console.log('❌ Invalid contact number');
      return res.status(400).json({
        success: false,
        message: 'Contact number must be exactly 10 digits'
      });
    }

    // Check for existing admin
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { contactNumber: contactNumber }
      ]
    });

    if (existingAdmin) {
      console.log('❌ Admin already exists');
      return res.status(400).json({
        success: false,
        message: 'Admin with this email or contact number already exists'
      });
    }

    // Create new admin
    console.log('✅ Creating new admin account...');
    const newAdmin = new Admin({
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: 'admin',
      isAdmin: true
    });

    const savedAdmin = await newAdmin.save();
    console.log('✅ Admin account created successfully');

    // Generate JWT token
    const token = generateToken({
      id: savedAdmin._id,
      name: savedAdmin.name,
      email: savedAdmin.email,
      role: savedAdmin.role,
      isAdmin: savedAdmin.isAdmin
    });

    console.log('✅ JWT token generated');

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        token: token,
        admin: {
          id: savedAdmin._id,
          name: savedAdmin.name,
          email: savedAdmin.email,
          contactNumber: savedAdmin.contactNumber,
          role: savedAdmin.role,
          isAdmin: savedAdmin.isAdmin,
          createdAt: savedAdmin.createdAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Admin registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `An admin with this ${field} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error during admin registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    successResponse(res, 200, 'Approval status updated successfully', { registration })
  } catch (error) {
    console.error('Update approval status error:', error)
    errorResponse(res, 500, 'Server error while updating approval status')
  }
}

// Retry Google Sheets sync for a specific registration
const retrySheetSync = async (req, res) => {
  try {
    const { registrationId } = req.params;
    
    // Find the registration
    const registration = await GameRegistration.findOne({ registrationId });
    
    if (!registration) {
      return errorResponse(res, 404, 'Registration not found');
    }
    
    console.log(`📊 Admin retry: Attempting to sync registration ${registrationId} to Google Sheet...`);
    
    // Attempt to sync to Google Sheet
    const sheetResult = await sheetsService.addRegistration(registration);
    
    // Update registration with new sync status
    registration.sheetSync = {
      success: sheetResult.success,
      error: sheetResult.success ? null : sheetResult.error,
      lastAttempt: new Date(),
      rowNumber: sheetResult.rowNumber || null
    };
    
    await registration.save();
    
    if (sheetResult.success) {
      console.log(`✅ Admin retry: Registration ${registrationId} synced to Google Sheet successfully`);
      return successResponse(res, 200, 'Registration synced to Google Sheet successfully', {
        registrationId,
        rowNumber: sheetResult.rowNumber,
        syncedAt: new Date()
      });
    } else {
      console.error(`❌ Admin retry: Failed to sync registration ${registrationId}:`, sheetResult.error);
      return errorResponse(res, 500, 'Failed to sync registration to Google Sheet', {
        registrationId,
        error: sheetResult.error
      });
    }
    
  } catch (error) {
    console.error('Admin sheet retry error:', error);
    return errorResponse(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllRegistrations,
  updateRegistrationStatus,
  retrySheetSync
}