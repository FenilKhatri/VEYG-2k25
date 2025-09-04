const nodemailer = require('nodemailer')
const PDFDocument = require('pdfkit')
require('dotenv').config()

// Test email functionality
const testEmailIntegration = async () => {
  try {
    console.log('🧪 Testing email integration...')
    
    // Test student data
    const testStudent = {
      name: 'Test User',
      email: 'veyg.notification@gmail.com', // Send to same email for testing
      contactNumber: '1234567890',
      collegeName: 'Test College',
      gender: 'Male',
      _id: 'test123'
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    console.log('📧 Email transporter created')

    // Generate PDF in memory
    const pdfBuffer = await generateRegistrationPDF(testStudent)
    console.log('📄 PDF generated successfully')

    // Email options
    const mailOptions = {
      from: `"VEYG 2025" <${process.env.EMAIL_USER}>`,
      to: testStudent.email,
      subject: 'Test: VEYG 2025 Registration Confirmation 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">VEYG 2025 Test Email</h1>
            <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px;">Email Integration Test</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Email Test Successful!</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              This is a test email to verify that the VEYG 2025 email integration is working properly.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
              <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${testStudent.name}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${testStudent.email}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Test Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              PDF attachment has been generated and included with this email.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `VEYG_2025_Test_Registration.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    }

    // Send email
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Test email sent successfully!')
    console.log('📬 Message ID:', result.messageId)
    
    return true
  } catch (error) {
    console.error('❌ Email test failed:', error.message)
    return false
  }
}

// Generate PDF function
const generateRegistrationPDF = (student) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const chunks = []

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Header
    doc.rect(0, 0, doc.page.width, 120).fill('#667eea')
    
    // Title
    doc.fillColor('white')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('VEYG 2025 - EMAIL TEST', 50, 40, { align: 'center' })
    
    doc.fontSize(16)
       .font('Helvetica')
       .text('Registration Email Integration Test', 50, 70, { align: 'center' })

    // Reset position and color
    doc.fillColor('black')
    let yPosition = 160

    // Test message
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .text('Email Integration Test Successful!', 50, yPosition)
    
    yPosition += 40

    doc.fontSize(14)
       .font('Helvetica')
       .text(`Test User: ${student.name}`, 50, yPosition)
    
    yPosition += 30

    doc.text('This PDF was generated successfully as part of the email integration test.', 50, yPosition, { width: 500 })
    yPosition += 40

    // Test Details Box
    doc.rect(50, yPosition, 500, 150)
       .stroke('#667eea')
       .lineWidth(2)

    yPosition += 20

    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('Test Details:', 70, yPosition)
    
    yPosition += 30

    doc.fontSize(12)
       .font('Helvetica')
    
    const details = [
      ['Test Date:', new Date().toLocaleDateString()],
      ['Test Time:', new Date().toLocaleTimeString()],
      ['Email Service:', 'Gmail SMTP'],
      ['PDF Generation:', 'PDFKit'],
      ['Status:', 'SUCCESS']
    ]

    details.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, 70, yPosition, { width: 150, continued: true })
      doc.font('Helvetica').text(` ${value}`, { width: 300 })
      yPosition += 20
    })

    yPosition += 40

    // Footer
    doc.fontSize(10)
       .fillColor('#666')
       .text('VEYG 2025 Email Integration Test - SUCCESS', 50, yPosition, { align: 'center' })

    doc.end()
  })
}

// Run the test
if (require.main === module) {
  testEmailIntegration()
    .then(success => {
      if (success) {
        console.log('🎉 Email integration test completed successfully!')
        process.exit(0)
      } else {
        console.log('💥 Email integration test failed!')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Test execution error:', error)
      process.exit(1)
    })
}

module.exports = { testEmailIntegration }
