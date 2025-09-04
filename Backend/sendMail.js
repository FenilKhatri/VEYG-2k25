const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const GameRegistration = require('./models/GameRegistration');
require('dotenv').config();

// Create PDF with dynamic registration data
function createRegistrationPDF(registrationData) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const fileName = 'registration_confirmation.pdf';
        const filePath = path.join(__dirname, fileName);

        doc.pipe(fs.createWriteStream(filePath));

        // Add content to PDF with dynamic data
        doc.fontSize(28)
            .fillColor('#007bff')
            .text('VEYG 2025', 50, 50, { align: 'center' });

        doc.fontSize(20)
            .fillColor('#333')
            .text('Registration Confirmation', 50, 100, { align: 'center' });

        doc.fontSize(18)
            .fillColor('#28a745')
            .text('🎉 Thank you for registration!', 50, 150, { align: 'center' });

        // Registration Details
        doc.fontSize(14)
            .fillColor('#333')
            .text('Registration Details:', 50, 200);

        doc.fontSize(12)
            .fillColor('#666')
            .text(`Registration ID: ${registrationData.registrationId || registrationData._id}`, 70, 230)
            .text(`Game: ${registrationData.gameName}`, 70, 250)
            .text(`Registration Type: ${registrationData.registrationType}`, 70, 270)
            .text(`Total Amount: ₹${registrationData.totalAmount}`, 70, 290)
            .text(`Status: ${registrationData.approvalStatus || 'Pending'}`, 70, 310);

        // Team Leader Details
        doc.fontSize(14)
            .fillColor('#333')
            .text('Team Leader Details:', 50, 350);

        doc.fontSize(12)
            .fillColor('#666')
            .text(`Name: ${registrationData.teamLeader?.fullName || 'N/A'}`, 70, 380)
            .text(`Email: ${registrationData.teamLeader?.email || 'N/A'}`, 70, 400)
            .text(`Contact: ${registrationData.teamLeader?.contactNumber || 'N/A'}`, 70, 420)
            .text(`College: ${registrationData.teamLeader?.collegeName || 'N/A'}`, 70, 440);

        // Team Members (if any)
        if (registrationData.teamMembers && registrationData.teamMembers.length > 0) {
            doc.fontSize(14)
                .fillColor('#333')
                .text('Team Members:', 50, 480);

            let yPos = 510;
            registrationData.teamMembers.forEach((member, index) => {
                doc.fontSize(12)
                    .fillColor('#666')
                    .text(`${index + 1}. ${member.fullName} - ${member.email}`, 70, yPos);
                yPos += 20;
            });
        }

        // Footer
        doc.fontSize(12)
            .fillColor('#666')
            .text('Your registration has been successfully processed.', 50, 600, { align: 'center' })
            .text('We look forward to seeing you at VEYG 2025!', 50, 620, { align: 'center' });

        doc.fontSize(10)
            .fillColor('#999')
            .text(`Generated on: ${new Date().toLocaleString()}`, 50, 660, { align: 'center' })
            .text('VEYG 2025 - Saffrony Institute of Technology', 50, 680, { align: 'center' });

        doc.end();

        doc.on('end', () => {
            resolve(filePath);
        });

        doc.on('error', (err) => {
            reject(err);
        });
    });
}

// Send email to individual participant
async function sendRegistrationEmail(registration) {
    try {
        console.log(`📧 Processing email for: ${registration.teamLeader?.fullName}`);
        
        // Create personalized PDF
        const pdfPath = await createRegistrationPDF(registration);
        
        // Setup email transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: registration.teamLeader?.email,
            subject: 'VEYG 2025 - Registration Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa;">
                    <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #007bff; margin: 0;">VEYG 2025</h1>
                            <p style="color: #6c757d; margin: 5px 0;">Registration Confirmation</p>
                        </div>
                        
                        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #155724; margin: 0 0 10px 0;">🎉 Registration Confirmed!</h3>
                            <p style="color: #155724; margin: 0;"><strong>Thank you for registering for VEYG 2025!</strong></p>
                        </div>
                        
                        <div style="margin: 20px 0;">
                            <p>Dear <strong>${registration.teamLeader?.fullName || 'Participant'}</strong>,</p>
                            <p>Your registration has been successfully processed. Here are your details:</p>
                            <ul style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                                <li><strong>Registration ID:</strong> ${registration.registrationId || registration._id}</li>
                                <li><strong>Game:</strong> ${registration.gameName}</li>
                                <li><strong>Type:</strong> ${registration.registrationType}</li>
                                <li><strong>Amount:</strong> ₹${registration.totalAmount}</li>
                                <li><strong>Status:</strong> ${registration.approvalStatus || 'Pending'}</li>
                            </ul>
                            <p>Please find your detailed confirmation document attached as a PDF.</p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
                        
                        <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
                            Best regards,<br>
                            <strong>VEYG 2025 Team</strong><br>
                            <small>Saffrony Institute of Technology</small>
                        </p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'Registration_Confirmation.pdf',
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        console.log('📧 Sending email with PDF attachment...');
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${registration.teamLeader?.fullName}: ${info.messageId}`);

        // Clean up PDF file
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }

        return { success: true, participant: registration.teamLeader?.fullName, messageId: info.messageId };

    } catch (error) {
        console.error(`❌ Failed to send email to ${registration.teamLeader?.fullName}:`, error.message);
        return { success: false, participant: registration.teamLeader?.fullName, error: error.message };
    }
}

// Main function to send emails to all registered participants
async function sendBulkRegistrationEmails() {
    try {
        console.log('🚀 Starting bulk email process...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📊 Connected to database');
        
        // Fetch all game registrations
        const registrations = await GameRegistration.find({});
        console.log(`👥 Found ${registrations.length} game registrations`);
        
        if (registrations.length === 0) {
            console.log('📭 No registrations found in database');
            return;
        }
        
        const results = [];
        let successCount = 0;
        let failureCount = 0;
        
        // Send emails with delay to avoid rate limiting
        for (let i = 0; i < registrations.length; i++) {
            const registration = registrations[i];
            console.log(`\n📧 Processing ${i + 1}/${registrations.length}: ${registration.teamLeader?.fullName}`);
            
            const result = await sendRegistrationEmail(registration);
            results.push(result);
            
            if (result.success) {
                successCount++;
            } else {
                failureCount++;
            }
            
            // Add delay between emails to avoid rate limiting (2 seconds)
            if (i < registrations.length - 1) {
                console.log('⏳ Waiting 2 seconds before next email...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // Summary
        console.log('\n🎉 Bulk email process completed!');
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${failureCount}`);
        console.log(`📊 Total: ${registrations.length}`);
        
        // Show failed emails if any
        if (failureCount > 0) {
            console.log('\n❌ Failed emails:');
            results.filter(r => !r.success).forEach(r => {
                console.log(`  - ${r.participant}: ${r.error}`);
            });
        }
        
    } catch (error) {
        console.error('💥 Bulk email process failed:', error.message);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('📊 Database connection closed');
    }
}

// Run the bulk email function
sendBulkRegistrationEmails();