const Student = require('../models/Student')
const { generateToken } = require('../utils/auth')
const { successResponse, errorResponse } = require('../utils/response')
const autoExcelStore = require('../utils/autoExcelStore')

// Student Registration
const studentRegister = async (req, res) => {
  try {
    const { name, contactNumber, email, password, collegeName, gender } = req.body

    // Check if student already exists with this email
    const existingStudent = await Student.findOne({ email })
    if (existingStudent) {
      return errorResponse(res, 400, 'Student with this email already exists')
    }

    // Create new student
    const student = new Student({
      name,
      contactNumber,
      email,
      password,
      collegeName,
      gender
    })

    await student.save()

    // Auto-save student registration to Excel
    await autoExcelStore.saveStudentRegistration(student)
    await autoExcelStore.saveCombinedRegistration(student, null)

    // Generate token
    const token = generateToken({
      id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      isAdmin: student.isAdmin
    })

    successResponse(res, 201, 'Student registered successfully', {
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        contactNumber: student.contactNumber,
        role: student.role,
        isAdmin: student.isAdmin
      }
    })
  } catch (error) {
    console.error('Student registration error:', error)
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Email already exists')
    }
    errorResponse(res, 500, 'Server error during student registration')
  }
}

// Student Login
const studentLogin = async (req, res) => {
  try {
    const { name, password } = req.body

    // Find student by name
    const student = await Student.findOne({ name }).select('+password')
    if (!student) {
      return errorResponse(res, 401, 'Invalid credentials')
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password)
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid credentials')
    }

    // Generate token
    const token = generateToken({
      id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      isAdmin: student.isAdmin
    })

    successResponse(res, 200, 'Student login successful', {
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
    })
  } catch (error) {
    console.error('Student login error:', error)
    errorResponse(res, 500, 'Server error during student login')
  }
}

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
    if (!student) {
      return errorResponse(res, 404, 'Student not found')
    }

    successResponse(res, 200, 'Student profile retrieved successfully', {
      name: student.name,
      email: student.email,
      contactNumber: student.contactNumber,
      role: student.role
    })
  } catch (error) {
    console.error('Get student profile error:', error)
    errorResponse(res, 500, 'Server error while fetching student profile')
  }
}

// Update Student Profile
const updateStudentProfile = async (req, res) => {
  try {
    const { name } = req.body

    if (!name || name.trim() === '') {
      return errorResponse(res, 400, 'Name is required')
    }

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    )

    if (!student) {
      return errorResponse(res, 404, 'Student not found')
    }

    successResponse(res, 200, 'Profile updated successfully', {
      name: student.name,
      email: student.email,
      contactNumber: student.contactNumber,
      role: student.role
    })
  } catch (error) {
    console.error('Update student profile error:', error)
    errorResponse(res, 500, 'Server error while updating profile')
  }
}

module.exports = {
  studentRegister,
  studentLogin,
  getStudentProfile,
  updateStudentProfile
}
