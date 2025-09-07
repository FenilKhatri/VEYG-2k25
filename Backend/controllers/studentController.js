const Student = require('../models/Student')
const { generateToken } = require('../utils/auth')
const { successResponse, errorResponse } = require('../utils/response')
const nodemailer = require('nodemailer')
const PDFDocument = require('pdfkit')
require('dotenv').config()

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

    console.log('✅ Student registration completed successfully')

    // Send registration confirmation email
    try {
      await sendRegistrationEmail(student)
      console.log('✅ Registration email sent successfully')
    } catch (emailError) {
      console.error('❌ Failed to send registration email:', emailError)
      // Don't fail registration if email fails
    }

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
    const { email, password } = req.body

    // Find student by email
    const student = await Student.findOne({ email }).select('+password')
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

// Email sending function
const sendRegistrationEmail = async (student) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Generate PDF in memory
  const pdfBuffer = await generateRegistrationPDF(student)

  // Email options
  const mailOptions = {
    from: `"VEYG 2025" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: 'Welcome to VEYG 2025 - Registration Confirmed! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to VEYG 2025!</h1>
          <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px;">Registration Confirmed Successfully</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Dear ${student.name},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            Congratulations! Your registration for <strong>VEYG 2025</strong> has been confirmed successfully. 
            We're excited to have you join us for this amazing event!
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Registration Details:</h3>
            <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${student.name}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${student.email}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Contact:</strong> ${student.contactNumber}</p>
            <p style="margin: 5px 0; color: #555;"><strong>College:</strong> ${student.collegeName}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Please find your registration confirmation attached as a PDF. Keep this for your records.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 25px; display: inline-block;">
              <strong>🎮 Get Ready for VEYG 2025! 🏆</strong>
            </div>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Stay tuned for more updates about the event schedule, game details, and important announcements.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 14px; text-align: center;">
            Best regards,<br>
            <strong>VEYG 2025 Team</strong><br>
            <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #667eea;">${process.env.SUPPORT_EMAIL}</a>
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `VEYG_2025_Registration_${student.name.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  }

  // Send email
  await transporter.sendMail(mailOptions)
}

// Generate PDF function
const generateRegistrationPDF = (student) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const chunks = []

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Header with gradient effect simulation
    doc.rect(0, 0, doc.page.width, 120).fill('#667eea')

    // Title
    doc.fillColor('white')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('VEYG 2025', 50, 40, { align: 'center' })

    doc.fontSize(16)
      .font('Helvetica')
      .text('Registration Confirmation', 50, 70, { align: 'center' })

    // Reset position and color
    doc.fillColor('black')
    let yPosition = 160

    // Confirmation message
    doc.fontSize(18)
      .font('Helvetica-Bold')
      .text('Registration Confirmed!', 50, yPosition)

    yPosition += 40

    doc.fontSize(14)
      .font('Helvetica')
      .text(`Dear ${student.name},`, 50, yPosition)

    yPosition += 30

    doc.text('Congratulations! Your registration for VEYG 2025 has been confirmed successfully.', 50, yPosition, { width: 500 })
    yPosition += 40

    // Registration Details Box
    doc.rect(50, yPosition, 500, 200)
      .stroke('#667eea')
      .lineWidth(2)

    yPosition += 20

    doc.fontSize(16)
      .font('Helvetica-Bold')
      .text('Registration Details:', 70, yPosition)

    yPosition += 30

    doc.fontSize(12)
      .font('Helvetica')

    const details = [
      ['Name:', student.name],
      ['Email:', student.email],
      ['Contact Number:', student.contactNumber],
      ['College:', student.collegeName],
      ['Gender:', student.gender],
      ['Registration Date:', new Date().toLocaleDateString()],
      ['Registration Time:', new Date().toLocaleTimeString()]
    ]

    details.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, 70, yPosition, { width: 150, continued: true })
      doc.font('Helvetica').text(` ${value}`, { width: 300 })
      yPosition += 20
    })

    yPosition += 40

    // Instructions
    doc.fontSize(12)
      .font('Helvetica')
      .text('Please keep this confirmation for your records. You will receive further updates about the event schedule and game details via email.', 50, yPosition, { width: 500 })

    yPosition += 40

    // Footer
    doc.fontSize(10)
      .fillColor('#666')
      .text('Thank you for registering with VEYG 2025!', 50, yPosition, { align: 'center' })

    yPosition += 20

    doc.text(`For any queries, contact us at: ${process.env.SUPPORT_EMAIL}`, 50, yPosition, { align: 'center' })

    doc.end()
  })
}

module.exports = {
  studentRegister,
  studentLogin,
  getStudentProfile,
  updateStudentProfile
}
