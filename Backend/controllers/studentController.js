const Student = require('../models/Student')
const { generateToken } = require('../utils/auth')
const { sendStudentWelcomeEmail } = require('../services/emailService')
require('dotenv').config()

// Student Registration
const studentRegister = async (req, res) => {
  try {
    const { name, contactNumber, email, password, collegeName, gender } = req.body

    // Check if student already exists with this email
    const existingStudent = await Student.findOne({ email })
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this email already exists' })
    }

    // Store plain password for email before hashing
    const plainPassword = password;

    // Create new student (password will be hashed by pre-save hook)
    const student = new Student({
      name,
      contactNumber,
      email,
      password,           // This will be hashed by the model's pre-save hook
      collegeName,
      gender
    })

    await student.save()

    console.log('✅ Student registration completed successfully')

    // Send welcome email with plain password
    setImmediate(async () => {
      try {
        console.log('🔄 Sending welcome email to:', email);
        
        await sendStudentWelcomeEmail({
          name,
          email,
          collegeName
        }, plainPassword);
        
        console.log('✅ Welcome email sent successfully!');
      } catch (emailError) {
        console.error('❌ Welcome email failed:', emailError.message);
      }
    });

    // Generate token
    const token = generateToken({
      id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      isAdmin: student.isAdmin
    })

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        token,
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          contactNumber: student.contactNumber,
          role: student.role,
          isAdmin: student.isAdmin
        }
      }
    })
  } catch (error) {
    console.error('Student registration error:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: validationErrors 
      })
    }
    
    res.status(500).json({ success: false, message: 'Server error during student registration' })
  }
}

// Student Login
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find student by email
    const student = await Student.findOne({ email }).select('+password')
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken({
      id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      isAdmin: student.isAdmin
    })

    res.status(200).json({
      success: true,
      message: 'Student login successful',
      data: {
        token,
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          contactNumber: student.contactNumber,
          gender: student.gender,
          degree: student.degree,
          branch: student.branch,
          role: student.role,
          isAdmin: student.isAdmin
        }
      }
    })
  } catch (error) {
    console.error('Student login error:', error)
    res.status(500).json({ success: false, message: 'Server error during student login' })
  }
}

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      data: {
        name: student.name,
        email: student.email,
        contactNumber: student.contactNumber,
        collegeName: student.collegeName
      }
    })
  } catch (error) {
    console.error('Get student profile error:', error)
    res.status(500).json({ success: false, message: 'Server error while fetching student profile' })
  }
}

// Update Student Profile
const updateStudentProfile = async (req, res) => {
  try {
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name is required' })
    }

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    )

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: student.name,
        email: student.email,
        contactNumber: student.contactNumber,
        collegeName: student.collegeName
      }
    })
  } catch (error) {
    console.error('Update student profile error:', error)
    res.status(500).json({ success: false, message: 'Server error while updating profile' })
  }
}

// Email functionality removed as requested by user

module.exports = {
  studentRegister,
  studentLogin,
  getStudentProfile,
  updateStudentProfile
}